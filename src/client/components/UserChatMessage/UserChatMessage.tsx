import styles from "./UserChatMessage.module.css";
import React from "react";

interface Props {
    message: string;
}

export const UserChatMessage = ({ message }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.message}>{message}</div>
        </div>
    );
};
