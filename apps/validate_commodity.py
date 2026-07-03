from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# Create Spark Session
spark = (
    SparkSession.builder
    .appName("Commodity Validation")
    .master("spark://spark-master:7077")
    .config("spark.mongodb.write.connection.uri", "mongodb://mongodb:27017")
    .config("spark.mongodb.read.connection.uri", "mongodb://mongodb:27017")
    .getOrCreate()
)

# Read CSV
df = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv("/opt/spark/data/raw/commodity_trades.csv")
)

print("========== Original Data ==========")
df.show()

# Validation
valid_df = df.filter(
    col("trade_id").isNotNull() &
    col("commodity").isNotNull() &
    (col("price") > 0) &
    (col("quantity") > 0) &
    col("unit").isNotNull()
)

invalid_df = df.filter(
    col("trade_id").isNull() |
    col("commodity").isNull() |
    (col("price") <= 0) |
    (col("quantity") <= 0) |
    col("unit").isNull()
)

print("Valid Records :", valid_df.count())
print("Invalid Records :", invalid_df.count())

# Store Valid Data
valid_df.write \
    .format("mongodb") \
    .mode("overwrite") \
    .option("database", "commodity_data") \
    .option("collection", "commodity_validated") \
    .save()

# Store Invalid Data
invalid_df.write \
    .format("mongodb") \
    .mode("overwrite") \
    .option("database", "commodity_data") \
    .option("collection", "commodity_rejected") \
    .save()

print("Commodity data stored successfully in MongoDB.")

spark.stop()