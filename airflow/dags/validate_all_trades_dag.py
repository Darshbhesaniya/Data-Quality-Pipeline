from airflow import DAG
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator
from datetime import datetime

MONGO_JARS = (
    "/home/airflow/mongo-jars/mysql-connector-j-9.3.0.jar,"
    "/home/airflow/mongo-jars/mongo-spark-connector.jar,"
    "/home/airflow/mongo-jars/mongodb-driver-sync.jar,"
    "/home/airflow/mongo-jars/bson.jar,"
    "/home/airflow/mongo-jars/mongodb-driver-core.jar,"
    "/home/airflow/mongo-jars/bson-record-codec.jar"
)


with DAG(
    dag_id="validate_all_trades_pipeline",
    start_date=datetime(2026, 1, 1),
    schedule=None,
    catchup=False,
) as dag:

    validate_equity = SparkSubmitOperator(
        task_id="validate_equity_trades",
        application="/opt/spark/apps/validate_equity.py",
        conn_id="spark_default",
        jars=MONGO_JARS,
    )

    validate_bond = SparkSubmitOperator(
        task_id="validate_bond_trades",
        application="/opt/spark/apps/validate_bond.py",
        conn_id="spark_default",
        jars=MONGO_JARS,
    )

    validate_commodity = SparkSubmitOperator(
        task_id="validate_commodity_trades",
        application="/opt/spark/apps/validate_commodity.py",
        conn_id="spark_default",
        jars=MONGO_JARS,
    )

    validate_equity >> validate_bond >> validate_commodity