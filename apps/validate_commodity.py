from pyspark.sql import SparkSession
from pyspark.sql.functions import col

def parse_rule_value(value):
    try:
        return float(value)
    except:
        return value

def build_condition(rule):
    column_name = rule.column_name
    operator = rule.operator
    rule_value = parse_rule_value(rule.rule_value)

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
        return col(column_name) != rule_value

    elif operator == "IS NULL":
        return col(column_name).isNull()

    elif operator == "IS NOT NULL":
        return col(column_name).isNotNull()

    else:
        raise ValueError(f"Unsupported operator: {operator}")
    

DATASET_NAME = "Commodity Trades"

# Create Spark Session
spark = (
    SparkSession.builder
    .appName("Commodity Validation")
    .master("spark://spark-master:7077")
    .config("spark.mongodb.write.connection.uri", "mongodb://mongodb:27017")
    .config("spark.mongodb.read.connection.uri", "mongodb://mongodb:27017")
    .getOrCreate()
)

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

print("--------------------------Validations RULES----------------------------")

rules_df = rules_df.filter(col("dataset") == DATASET_NAME )
rules_df.printSchema()

rules_df.show(truncate=False)

rules = rules_df.collect()

conditions = []

for rule in rules:
    condition = build_condition(rule)

    conditions.append(condition)

    print("------------------------------------------------------------------")

    print("Rule: ",rule.rule_name)
    print("Condition: ", condition)


final_condition = conditions[0]

for condition in conditions[1:]:
    final_condition = final_condition & condition

# Read CSV
df = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv("/opt/spark/data/raw/commodity_trades.csv")
)

print(f"Total Records  : {df.count()}")

valid_df = df.filter(final_condition)

invalid_df = df.filter(~final_condition)

print("===================Valid Records=================")
valid_df.show()

print("===================InValid Records=================")
invalid_df.show()

print(f"valid Records   : {valid_df.count()}")
print(f"Invalid Records   : {invalid_df.count()}")







# Validation
# valid_df = df.filter(
#     col("trade_id").isNotNull() &
#     col("commodity").isNotNull() &
#     (col("price") > 0) &
#     (col("quantity") > 0) &
#     col("unit").isNotNull()
# )

# invalid_df = df.filter(
#     col("trade_id").isNull() |
#     col("commodity").isNull() |
#     (col("price") <= 0) |
#     (col("quantity") <= 0) |
#     col("unit").isNull()
# )

# print("Valid Records :", valid_df.count())
# print("Invalid Records :", invalid_df.count())




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