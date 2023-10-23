import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button/standard-button';
import TextField from '@atlaskit/textfield';

import { Label } from '@atlaskit/form';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

function FieldModal({
  handleSubmit,
  title = 'Add Field',
  btnAppearance = 'link',
  isDisabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const onClick = () => {
    handleSubmit({ label, placeholder });
    close();
  };

  return (
    <>
      <Button appearance={btnAppearance} isDisabled={isDisabled} onClick={open}>
        {title}
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close}>
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <div style={{ marginBottom: '10px' }}>
                <Label htmlFor="label">Field Name</Label>
                <TextField
                  id="label"
                  name="label"
                  placeholder="Field Name"
                  defaultValue={label}
                  value={label}
                  isRequired={true}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <TextField
                  id="placeholder"
                  name="placeholder"
                  placeholder="Placeholder"
                  defaultValue={placeholder}
                  value={placeholder}
                  isRequired={true}
                  autoComplete="off"
                  onChange={(e) => setPlaceholder(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={close} appearance="subtle">
                Cancel
              </Button>
              <Button
                type="submit"
                form="form-with-id"
                appearance="primary"
                onClick={onClick}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}

FieldModal.propTypes = {
  handleSubmit: PropTypes.func,
  title: PropTypes.string,
  btnAppearance: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default FieldModal;
