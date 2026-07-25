FROM apache/spark:4.1.1

USER root

RUN curl -L -o /opt/spark/jars/mongo-spark-connector_2.13-10.4.1.jar \
    https://repo1.maven.org/maven2/org/mongodb/spark/mongo-spark-connector_2.13/10.4.1/mongo-spark-connector_2.13-10.4.1.jar && \
    curl -L -o /opt/spark/jars/mongodb-driver-sync-5.2.1.jar \
    https://repo1.maven.org/maven2/org/mongodb/mongodb-driver-sync/5.2.1/mongodb-driver-sync-5.2.1.jar && \
    curl -L -o /opt/spark/jars/mongodb-driver-core-5.2.1.jar \
    https://repo1.maven.org/maven2/org/mongodb/mongodb-driver-core/5.2.1/mongodb-driver-core-5.2.1.jar && \
    curl -L -o /opt/spark/jars/bson-5.2.1.jar \
    https://repo1.maven.org/maven2/org/mongodb/bson/5.2.1/bson-5.2.1.jar && \
    curl -L -o /opt/spark/jars/bson-record-codec-5.2.1.jar \
    https://repo1.maven.org/maven2/org/mongodb/bson-record-codec/5.2.1/bson-record-codec-5.2.1.jar && \
    curl -L -o /opt/spark/jars/mysql-connector-j-9.3.0.jar \
    https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/9.3.0/mysql-connector-j-9.3.0.jar

USER spark