import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Stack, TextField } from "@fluentui/react";
import { Button, Tooltip, Field, Textarea } from "@fluentui/react-components";
import { Send28Filled } from "@fluentui/react-icons";
import { requireLogin } from "../../auth/authConfig";

import styles from "./QuestionInput.module.css";
import React from 'react';

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    initQuestion?: string;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, initQuestion }: Props) => {
	const [question, setQuestion] = useState<string>("");

    useEffect(() => {
        initQuestion && setQuestion(initQuestion);
    }, [initQuestion]);

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

		const { instance, accounts } = useMsal();
		if (accounts.length > 0) {
			const { username } = accounts[0];
	
			if (username == '') return null;
			const disableRequiredAccessControl = requireLogin;
			const sendQuestionDisabled = disabled || !question.trim() || requireLogin;

			if (disableRequiredAccessControl) {
					placeholder = "Please login to continue...";
			}

			return (
					<Stack horizontal className={styles.questionInputContainer}>
							<TextField
									className={styles.questionInputTextArea}
									disabled={disableRequiredAccessControl}
									placeholder={placeholder}
									multiline
									resizable={false}
									borderless
									value={question}
									onChange={onQuestionChange}
									onKeyDown={onEnterPress}
							/>
							<div className={styles.questionInputButtonsContainer}>
									<Tooltip content="Ask question button" relationship="label">
											<Button size="large" icon={<Send28Filled primaryFill="rgba(115, 118, 225, 1)" />} disabled={sendQuestionDisabled} onClick={sendQuestion} />
									</Tooltip>
							</div>
					</Stack>
			);
		}
		return null;
};
