import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  Actions,
  Button,
  CloseButton,
  Content,
  Description,
  Input,
  Overlay,
  Title,
} from "../styles/TopicModal.styles";
import { MandatoryInp } from "../styles/common.styles";

export default function TopicModal({ isOpen, onSave, onClose }) {
  const [topicName, setTopicName] = useState("");

  const handleSubmit = () => {
    if (!topicName.trim()) return;
    onSave(topicName);
    setTopicName("");
    onClose();
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>
            Add New Topic <MandatoryInp />
          </Title>
          <Description>
            Enter a topic name to organize your questions.
          </Description>

          <Input
            placeholder="e.g. Algebra"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
          />

          <Actions>
            <Button onClick={onClose}>Cancel</Button>

            <Dialog.Close asChild>
              <Button primary onClick={handleSubmit}>
                Save
              </Button>
            </Dialog.Close>
          </Actions>

          <CloseButton onClick={onClose}>✕</CloseButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
