CREATE TABLE IF NOT EXISTS validation_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    dataset VARCHAR(50) NOT NULL,
    column_name VARCHAR(100) NOT NULL,
    operator VARCHAR(20) NOT NULL,
    rule_value VARCHAR(100),
    error_message VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS datasets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dataset_columns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataset_id INT NOT NULL,
    column_name VARCHAR(100) NOT NULL,
    data_type VARCHAR(50) DEFAULT 'STRING',
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

-- Seed Datasets
INSERT IGNORE INTO datasets (id, name, description) VALUES
(1, 'Equity Trades', 'Stock market equity trade transactions'),
(2, 'Bond Trades', 'Fixed income and bond market trade records'),
(3, 'Commodity Trades', 'Commodity exchange trade transactions');

-- Seed Columns for Equity Trades
INSERT IGNORE INTO dataset_columns (dataset_id, column_name) VALUES
(1, 'trade_id'),
(1, 'trade_timestamp'),
(1, 'division'),
(1, 'exchange'),
(1, 'symbol'),
(1, 'company_name'),
(1, 'trade_type'),
(1, 'quantity'),
(1, 'price'),
(1, 'trade_value'),
(1, 'currency'),
(1, 'trader_id'),
(1, 'client_id'),
(1, 'order_type'),
(1, 'status');

-- Seed Columns for Bond Trades
INSERT IGNORE INTO dataset_columns (dataset_id, column_name) VALUES
(2, 'trade_id'),
(2, 'bond_name'),
(2, 'issuer'),
(2, 'price'),
(2, 'quantity'),
(2, 'coupon_rate'),
(2, 'maturity_date');

-- Seed Columns for Commodity Trades
INSERT IGNORE INTO dataset_columns (dataset_id, column_name) VALUES
(3, 'trade_id'),
(3, 'commodity'),
(3, 'price'),
(3, 'quantity'),
(3, 'unit'),
(3, 'trade_date');

-- Seed Sample Validation Rules
INSERT INTO validation_rules (rule_name, dataset, column_name, operator, rule_value, error_message, is_active) VALUES
('Equity Positive Price', 'Equity Trades', 'price', '>', '0', 'Equity price must be greater than 0', TRUE),
('Equity Positive Quantity', 'Equity Trades', 'quantity', '>', '0', 'Equity quantity must be positive', TRUE),
('Equity Valid Symbol', 'Equity Trades', 'symbol', 'IS NOT NULL', NULL, 'Stock ticker symbol cannot be null', TRUE),
('Equity Valid Trade ID', 'Equity Trades', 'trade_id', 'IS NOT NULL', NULL, 'Trade ID must not be null', TRUE),
('Bond Positive Price', 'Bond Trades', 'price', '>', '0', 'Bond price must be greater than 0', TRUE),
('Bond Positive Quantity', 'Bond Trades', 'quantity', '>', '0', 'Bond quantity must be positive', TRUE),
('Bond Issuer Required', 'Bond Trades', 'issuer', 'IS NOT NULL', NULL, 'Issuer cannot be null', TRUE),
('Commodity Positive Price', 'Commodity Trades', 'price', '>', '0', 'Commodity price must be greater than 0', TRUE),
('Commodity Positive Quantity', 'Commodity Trades', 'quantity', '>', '0', 'Commodity quantity must be positive', TRUE),
('Commodity Name Required', 'Commodity Trades', 'commodity', 'IS NOT NULL', NULL, 'Commodity name cannot be null', TRUE);