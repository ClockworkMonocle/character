import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Drawer from '../components/Drawer';
import ListItem from '../components/ListItem/v2';
import Confirm from './Confirm';
import SimpleCreate from './SimpleCharacterCreateModal';
import EditProfile from './EditProfile';

import { getCharactersForUser, signOut, createCharacter, deleteCharacter } from '../state/actions';

export class Profile extends Component {
  state = {
    menuOpen: false,
    confirmDelete: false,
    deleteId: null,
    createNewCharacter: false,
    editProfile: false,
  }

  componentDidMount() {
    const { user } = this.props.state;
    if (user.get('uid')) {
      this.loadCharacters(user.get('uid'));
    }
  }

  loadCharacters = (uid) => this.props.dispatch(getCharactersForUser(uid));

  loadCharacter = (id) => this.props.history.push(`/app/character/${id}`)

  deleteCharacter = (id) => {
    this.setState({
      confirmDelete: true,
      deleteId: id,
      characterToDelete: this.props.state.user.getIn(['characters', id, 'characterName'])
    });
  }

  handleConfirm = (answer) => {
    switch(answer) {
      case 'yes':
        let charId = this.state.deleteId;
        let userId = this.props.state.user.get('uid');
        this.props.dispatch(deleteCharacter(userId, charId))
        this.setState({
          confirmDelete: false,
          characterToDelete: '',
          charId: null,
        });
        break;
      case 'no':
        this.setState({
          confirmDelete: false,
          characterToDelete: '',
          charId: null,
        });
        break;
    }
  }

  handleSimpleCreate = (action) => {
    let userId = this.props.state.user.get('uid');
    this.props.dispatch(createCharacter(userId, action.data.name));
  }

  signOut = () => {
    this.props.dispatch(signOut());
  }

  menuContent = () => {
    return <section>
      <div className='drawer-header'><p>Account</p></div>
      <div className='drawer-content p3'>
        <button
          onClick={() => this.setState({ editProfile: true })}
          className='btn btn-default btn-primary block mb2 mt6 full-width'
        ><Icon icon='fa fa-pencil'/> Edit Profile</button>
        <button
          onClick={this.signOut}
          className='btn btn-default btn-danger block mb2 full-width'
        ><Icon icon='fa fa-sign-out'/> Sign Out</button>
      </div>
    </section>
  }

  renderCharacters = () => {
    if (!this.props.state.user.get('characters')) return null;

    return this.props.state.user.get('characters').valueSeq().map((character, i) => {
      let initials = character.get('characterName')
        .split(' ')
        .map(p => p.charAt(0))
        .filter((l, i, arr) => i < 1 || i === arr.length - 1)
        .join('');

      return (
        <ListItem
          key={i}
          className='interactable'
          name={character.get('characterName')}
          subtext={`level ${character.get('characterLevel')} | ${character.get('characterClass')}`}
          glyph={
            <div className='text-gray bg-gray flex flex-center' style={{ width: 50, height: 50}}>
              <span>{initials}</span>
            </div>
          }
          addon={
            <div className='p3 interactable' onClick={this.deleteCharacter.bind(this, character.get('characterId'))}>
              <Icon className='text-red' icon='fa fa-user-times'/>
            </div>
          }
          onClick={() => this.loadCharacter(character.get('characterId'))}
        />
      );
    });
  }

  getDisplayImg = () => {
    if (!this.props.state.user.get('uid')) return null;

    let user = this.props.state.user;

    return user.get('profileImg')
    ? <img className='profile-img left' src={user.get('profileImg')}/>
    : <div className='text-gray bg-gray flex flex-center left' style={{ width: 50, height: 50}}>
        <span>{user.get('displayName').charAt(0).toUpperCase()}</span>
      </div>
  }

  render() {
    let isLoadingProfile = this.props.state.status.get('userLoadingProfile');
    let isLoadingCharacters = this.props.state.status.get('characterListLoading');
    let isCreating = this.props.state.status.get('characterCreating');
    let listLoadError = this.props.state.status.getIn(['characterListLoadError', 'code']);
    let user = this.props.state.user;

    return (
      <div className="profile-container">
        <div className="profile-header interactable" onClick={() => this.setState({ menuOpen: true })}>
          { this.getDisplayImg() }
          <h5 className="profile-header-name left p2">{user.get('displayName')}</h5>
        </div>
        <Drawer
          id='account-menu'
          direction='left'
          overflowAppContainer='body'
          overflowPaneContainer='body'
          active={this.state.menuOpen}
          content={this.menuContent()}
          onDismiss={() => this.setState({ menuOpen: false })}
        />
        <div className="profile-content">
          <h3>Characters</h3>
          { isLoadingProfile || isLoadingCharacters
              ? <p>Loading...</p>
              : this.renderCharacters()
          }
          {
            !isLoadingProfile && !isLoadingCharacters &&
            <p
              className='subtext text-center p2 interactable'
              onClick={() => this.setState({ createNewCharacter: true })}
            ><Icon icon='fa fa-plus' /> Create a new character</p>
          }
          { listLoadError &&
              <p className='text-red'>{listLoadError}</p>
          }
        </div>
        <Loading isLoading={isLoadingCharacters || isLoadingProfile || isCreating}/>
        <Confirm
          active={this.state.confirmDelete}
          confirmName={this.state.characterToDelete}
          message={
            <div>
              <p className='text-red mt2 text-center'>Delete your character: <span className='text-blue important'><em>{this.state.characterToDelete}</em></span> ?</p>
              <p className='important mt2 text-center'>Note: This is a permanent action! It cannot be undone!</p>
            </div>
          }
          onConfirm={this.handleConfirm}
        />
        <SimpleCreate
          active={this.state.createNewCharacter}
          onDismiss={() => this.setState({ createNewCharacter: false })}
          onCreate={this.handleSimpleCreate}
        />
        <EditProfile
          active={this.state.editProfile}
          profileImg={this.props.state.user.get('profileImg')}
          displayName={this.props.state.user.get('displayName')}
          onDismiss={() => this.setState({ editProfile: false, menuOpen: false })}
          userId={this.props.state.user.get('uid')}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

export default withRouter(Profile);
