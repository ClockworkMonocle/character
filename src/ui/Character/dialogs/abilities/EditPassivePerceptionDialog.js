'use strict';

import React from 'react';

import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal';
import { createSaveBtn, createCancelBtn } from '../../../components/Modal/buttons';
import ConfirmModal from '../ConfirmModal';

export default React.createClass({
  displayName: 'EditPassivePerceptionDialog',

  propTypes: {
    active: React.PropTypes.bool.isRequired,
    onDismiss: React.PropTypes.func.isRequired,
    bonus: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      bonus: this.props.bonus,
      dirty: false,
      confirmCancel: false,
    }
  },

  handleSave() {
    let bonus = this.state.bonus;

    if (bonus === '') return;

    this.props.onChange({
      type: 'PASSIVE_PERCEPTION_EDIT',
      data: {
        bonus,
      },
    });
    this.props.onDismiss();
  },

  handleCancel() {
    if (!this.state.dirty) {
      return this.props.onDismiss();
    }

    this.setState({ confirmCancel: true });
  },

  handleConfirm(answer) {
    switch (answer) {
      case 'no':
        return this.setState({ confirmCancel: false });
      case 'yes':
        this.setState({ confirmCancel: false, dirty: false, bonus: this.props.bonus });
        this.props.onDismiss();
        break;
    }
  },

  validateBonus(ev) {
    if (ev.target.value === '') {
      return this.setState({ bonus: '', dirty: true });
    }

    let num = Number(ev.target.value);

    if (!isNaN(num)) {
      this.setState({ bonus: num, dirty: true });
    }
  },

  getContent() {
    return <section>
      <div className='modal-header'>
        <h3>Passive Perception</h3>
      </div>
      <div className='modal-content'>
        <div className='inputs'>
          <label htmlFor='ppBonus'>Bonuses</label>
          <input
            id='ppBonus'
            type='text'
            value={this.state.bonus}
            placeholder={this.props.bonus}
            onChange={this.validateBonus}
          />
          <p className='subtext mt1'>Your passive perception is the total of 10 plus Perception Skill Score plus any bonuses above.</p>
        </div>
      </div>
      <div className='modal-footer'>
        { createSaveBtn(this.handleSave) }
        { createCancelBtn(this.handleCancel) }
      </div>
    </section>
  },

  render() {
    return <Modal
      id='edit-passive-perception'
      active={this.props.active}
      content={this.getContent()}
      onDismiss={this.handleCancel}
    >
      <ConfirmModal
        active={this.state.confirmCancel}
        onConfirm={this.handleConfirm}
      />
    </Modal>
  }
})