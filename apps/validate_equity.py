from pyspark.sql import SparkSession
from pyspark.sql.functions import col

def parse_rule_value(value):
    try:
        return float(value)
    except ValueError:
        return value


def build_condition(rule):
    column_name = rule.column_name  # extract column_name from rule 
    operator = rule.operator        # extract operator from rule
    rule_value = parse_rule_value(rule.rule_value) # extract value from rule (string or Number)

    if operator == ">":
        return col(column_name) > rule_value
    
    elif operator == ">=":
        return col(column_name) >= rule_value
    
    elif operator == "<":
        return col(column_name) < rule_value
    
    elif operator == "<=":
        return col(column_name) <= rule_value

    elif operator == "==":
        return col(column_name) == rule_value

    elif operator == "!=":
        return col(column_name) == rule_value

    elif operator == "IS NULL":
        return col(column_name).isNull()

    elif operator == "IS NOT NULL":
        return col(column_name).isNotNull()

    else:
        raise ValueError(f"Unsupported operator: {operator}")

DATASET_NAME = "Equity Trades"

# Create Spark Session
spark = (
    SparkSession.builder
    .appName("Equity Trade Validation")
    .master("spark://spark-master:7077")
    .config("spark.mongodb.write.connection.uri", "mongodb://mongodb:27017")
    .config("spark.mongodb.read.connection.uri", "mongodb://mongodb:27017")
    .getOrCreate()
)

# Read rules from mysql
rules_df = (
    spark.read
    .format("jdbc")
    .option("url", "jdbc:mysql://mysql:3306/data_quality")
    .option("dbtable", "validation_rules")
    .option("user", "dq_user")
    .option("password", "dq_password")
    .option("driver", "com.mysql.cj.jdbc.Driver")
    .load()
)

print("===== Validation Rules =====")

rules_df = rules_df.filter(col("dataset") == DATASET_NAME)
rules_df.printSchema()


rules_df.show(truncate=False)

# this convert datframe to python list 
rules = rules_df.collect()

conditions = []

for rule in rules:
    condition = build_condition(rule)

    conditions.append(condition)

    print("---------------------------------------------------------------------------------------------")
    print("Rule: ",rule.rule_name)
    print("condition: ",condition)

final_condition = conditions[0]

for condition in conditions[1:]:
    final_condition = final_condition & condition

# Read CSV File
df = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv("/opt/spark/data/raw/equity_trades.csv")
)

print(f"\nTotal Records : {df.count()}")

valid_df = df.filter(final_condition)

invalid_df = df.filter(~final_condition)

print("\n==============Valid Records==============")
valid_df.show()

print("\n==============InValid Records==============")
invalid_df.show()

print(f"valid Records   : {valid_df.count()}")
print(f"Invalid Records   : {invalid_df.count()}")






# print("\n========== Schema ==========")
# df.printSchema()

# print(f"\nTotal Records : {df.count()}")

# # Validation Rules
# valid_df = df.filter(
#     col("trade_id").isNotNull() &
#     col("symbol").isNotNull() &
#     (col("price") > 0) &
#     (col("quantity") > 0) &
#     col("trader_id").isNotNull()
# )

# invalid_df = df.filter(
#     col("trade_id").isNull() |
#     col('symbol').isNull() |
#     (col("price") <= 0) |
#     (col("quantity") <= 0)
# )

# # Show Result
# print("\n=========== Valid Records ==============")
# valid_df.show(10)

# print("\n========= Invalid Records ==============")
# invalid_df.show(10)

# print(f"Valid Records   : {valid_df.count()}")
# print(f"Invalid Records : {invalid_df.count()}")

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