from pyspark.sql import SparkSession
from pyspark.sql.functions import col

# Create Spark Session
spark = (
    SparkSession.builder
    .appName("Bond Validation")
    .master("spark://spark-master:7077")
    .config("spark.mongodb.write.connection.uri", "mongodb://mongodb:27017")
    .config("spark.mongodb.read.connection.uri", "mongodb://mongodb:27017")
    .getOrCreate()
)

# Read Bond.CSV file 
df = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv("/opt/spark/data/raw/bond_trades.csv")
)

print("Original Data")
df.show()

# Validation 

valid_df = df.filter(
    col("trade_id").isNotNull() &
    col("bond_name").isNotNull() &
    col("issuer").isNotNull() &
    (col("price") > 0) &
    (col("quantity") > 0) &
    (col("coupon_rate") > 0)
)

invalid_df = df.filter(
    col("trade_id").isNull() |
    col("bond_name").isNull() |
    col("issuer").isNull() |
    (col("price") <= 0) |
    (col("quantity") <= 0) |
    (col("coupon_rate") <= 0) 
)

print("Valid Records :", valid_df.count())
print("Invalid Records :", invalid_df.count())

# Store Valid Data

valid_df.write \
    .format("mongodb") \
    .mode("overwrite") \
    .option("database", "bond_data") \
    .option("collection", "bond_validated") \
    .save()

# Store Invalid Data

invalid_df.write \
    .format("mongodb") \
    .mode("overwrite") \
    .option("database", "bond_data") \
    .option("collection", "bond_rejected") \
    .save()

print("Data Stored Successfully in MongoDB")

spark.stop()