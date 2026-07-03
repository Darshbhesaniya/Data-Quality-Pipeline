from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# Create Spark Session
spark = (
    SparkSession.builder
    .appName("Equity Trade Validation")
    .master("spark://spark-master:7077")
    .config("spark.mongodb.write.connection.uri", "mongodb://mongodb:27017")
    .config("spark.mongodb.read.connection.uri", "mongodb://mongodb:27017")
    .getOrCreate()
)

# Read CSV File
df = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv("/opt/spark/data/raw/equity_trades.csv")
)


print("\n========== Schema ==========")
df.printSchema()

print(f"\nTotal Records : {df.count()}")

# Validation Rules
valid_df = df.filter(
    col("trade_id").isNotNull() &
    col("symbol").isNotNull() &
    (col("price") > 0) &
    (col("quantity") > 0) &
    col("trader_id").isNotNull()
)

invalid_df = df.filter(
    col("trade_id").isNull() |
    col('symbol').isNull() |
    (col("price") <= 0) |
    (col("quantity") <= 0)
)

# Show Result
print("\n=========== Valid Records ==============")
valid_df.show(10)

print("\n========= Invalid Records ==============")
invalid_df.show(10)

print(f"Valid Records   : {valid_df.count()}")
print(f"Invalid Records : {invalid_df.count()}")

# Save Valid Data
(
    valid_df.write
    .format("mongodb")
    .mode("overwrite")
    .option("database", "equity_db") 
    .option("collection", "validated_trades")
    .save()
)

# Save Invalid Data
(
    invalid_df.write
    .format("mongodb")
    .mode("overwrite")
    .option("database", "equity_db")
    .option("collection", "rejected_trades")
    .save()
)

print("\nValidation Completed Successfully!")

spark.stop()