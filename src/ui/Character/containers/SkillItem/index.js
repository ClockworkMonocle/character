

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal';

import { AbilityScores } from '../../constants';

export default class extends React.Component {
  static displayName = 'SkillItem';

  // this component should not know anything about calculating scores
  // only that it must display a skill's score.
  // the calculation of what that score is should be done elsewhere
  static propTypes = {
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    trained: PropTypes.bool.isRequired,
    ability: PropTypes.string.isRequired,
    maxScore: PropTypes.number.isRequired,
    onSkillChange: PropTypes.func.isRequired
  };

  state = {
    maxWidth: 0,
    edit: false,
    dirty: false,
    confirm: false
  };

  componentDidMount() {
    let maxWidth = ReactDOM.findDOMNode(this.nameContainer).getBoundingClientRect().width - 10;
    this.setState({ maxWidth });
  }

  componentWillReceiveProps() {
    let maxWidth = ReactDOM.findDOMNode(this.nameContainer).getBoundingClientRect().width - 10;
    this.setState({ maxWidth });
  }

  noop = () => {};

  makeDirty = () => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
  };

  getModalContent = () => {
    return (
      <section> 
        <div className='modal-header'><h3>{this.props.name}</h3></div>
        <div className='modal-content'>
          <p>Governing Ability Score: <strong className={`text-${this.props.ability}`}>{AbilityScores[this.props.ability].display}</strong></p>
          <hr />
          <div className='inputs'>
            <input id='proficient' type='checkbox' ref='proficient' defaultChecked={this.props.trained} onChange={this.makeDirty}/>
            <label htmlFor='proficient'>Proficient?</label>
          </div>
        </div>
        <div className='modal-footer'>
          <button onClick={this.handleSave} className='text-green'>
            <p><Icon icon='fa fa-pencil' /> Save</p>
          </button>
        </div>
      </section>
    )
  };

  getConfirmContent = () => {
    return (
      <section> 
        <div className='modal-header'><h3>Are You Sure?</h3></div>
        <div className='modal-content'>
          <p>Cancel and lose any unsaved changes?</p>
        </div>
        <div className='modal-footer'>
          <button onClick={this.handleYes} className='text-green'>
            <p>Yes</p>
          </button>
          <button onClick={this.handleNo} className='text-red'>
            <p>No</p>
          </button>
        </div>
      </section>
    )
  };

  handleNo = () => {
    this.setState({ confirm: false });
  };

  handleYes = () => {
    this.setState({ dirty: false, edit: false, confirm: false });
  };

  openEditModal = () => {
    this.setState({ edit: true });
  };

  handleSave = () => {
    let data = { 
      trained: this.refs.proficient.checked,
      name: this.props.name
    }


    this.props.onSkillChange({ type: 'SKILL_EDIT', data });
    this.setState({ edit: false, dirty: false, confirm: false });    
  };

  dismissEdit = () => {
    if (this.state.dirty) {
      this.setState({ confirm: true });
      return;
    }

    this.setState({ edit: false, dirty: false, confirm: false });
  };

  render() {
    let style = {
      width: Math.floor((this.props.score / this.props.maxScore) * this.state.maxWidth)
    }

    return (
      <div className={`container-list-item flex flex-center ${this.props.trained ? 'proficient' : ''}`} onClick={this.openEditModal}>
        <div className={`skill-item-score flex flex-center mr2 bg-${this.props.ability}`}>
          {this.props.score}
        </div>
        <div className='container-list-item-content flex-auto' ref={ref => this.nameContainer = ref}>
          <p className='skill-item-name'>{this.props.name}</p>
          <span className={`skill-item-bar text-${this.props.ability}`} style={style} ></span>
        </div>
        <Modal id={`feature-${this.props.name}`} active={this.state.edit} content={this.getModalContent()} onDismiss={this.dismissEdit}/>
        <Modal id={`feature-${this.props.name}-confirm`} active={this.state.confirm} content={this.getConfirmContent()} onDismiss={this.noop}/>
      </div>
    )
  }
}