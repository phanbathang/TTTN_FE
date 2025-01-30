import React from 'react';
import styles from './NavBarComponent.module.scss';
import { Checkbox, Col, Rate, Row } from 'antd';

const NavBarComponent = () => {
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <div className={styles.WrapperTextValue}>{option}</div>
                    );
                });
            case 'checkbox':
                return (
                    <Checkbox.Group className={styles.WrapperCheckBox}>
                        {options.map((option) => {
                            return (
                                <Checkbox
                                    style={{ marginLeft: '0' }}
                                    value={option.value}
                                >
                                    {option.label}
                                </Checkbox>
                            );
                        })}
                        {/* <Row>
                            <Checkbox value="A"></Checkbox>
                            <Checkbox value="B"></Checkbox>
                        </Row> */}
                    </Checkbox.Group>
                );

            case 'star':
                return options.map((option) => {
                    return (
                        <div className={styles.WrapperStar}>
                            <Rate
                                style={{ fontSize: '12px' }}
                                disabled
                                defaultValue={option}
                            />
                            <span>{`Từ ${option} sao`}</span>
                        </div>
                    );
                });

            case 'price':
                return options.map((option) => {
                    return <div className={styles.WrapperPrice}>{option}</div>;
                });

            default:
                return {};
        }
    };
    return (
        <div style={{ backgroundColor: '#fff', marginTop: '10px' }}>
            <h4 className={styles.WrapperLabelText}>Label</h4>
            <div className={styles.WrapperContent}>
                {renderContent('text', ['tulanh', 'tv', 'maygiat'])}
            </div>
            <div className={styles.WrapperContent}>
                {renderContent('checkbox', [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' },
                    { value: 'c', label: 'C' },
                ])}
            </div>
            <div className={styles.WrapperContent}>
                {renderContent('star', [3, 4, 5])}
            </div>
            <div className={styles.WrapperContent}>
                {renderContent('price', ['duoi 40', 'tren 50'])}
            </div>
        </div>
    );
};

export default NavBarComponent;
