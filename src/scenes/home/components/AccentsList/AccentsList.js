import React from 'react'
import { Link, browserHistory } from 'react-router'
import DocumentTitle from 'react-document-title'
import makeDocumentTitle from '../../../../services/documentTitle'
import './styles.scss'

const AccentsList = React.createClass({

  componentDidMount () {
    componentHandler.upgradeDom() // MDL
    this.loadCountryAndAccentFromUrl()
  },

  componentDidUpdate (prevProps) {
    componentHandler.upgradeDom() // MDL
    if (!this.props.countrySelected ||
      prevProps.params.accentId !== this.props.params.accentId) {
      this.loadCountryAndAccentFromUrl()
    }
  },

  loadCountryAndAccentFromUrl () {
    const { params, countries, accents, countriesLoading, accentsLoading,
      countrySelected, accentSelected, onSelectCountry, onSelectAccent } = this.props

    if (countriesLoading || accentsLoading) {
      return
    }

    // Load country
    if (params.countryId !== countrySelected) {
      const country = countries.byId[params.countryId]
      if (!country) {
        browserHistory.push('/') // TODO: 404?
        return
      }
      onSelectCountry(params.countryId)
    }

    // Load accent
    if (params.accentId !== accentSelected) {
      if (params.accentId) {
        const accent = accents.byId[params.accentId]
        if (!accent) {
          browserHistory.push('/' + countrySelected + '/') // TODO: 404?
          return
        }
      }
      onSelectAccent(params.accentId || null)
    }
  },

  selectAccent (id) {
    const { accents, accentSelected, countrySelected } = this.props
    if (accentSelected !== id) {
      const accentUrl = '/' + countrySelected + '/' + id + '/'
      const videos = accents.byId[id].videos
      const url = videos ? accentUrl + '#' + videos[0] : accentUrl
      browserHistory.push(url)
    }
  },

  render () {
    const { countries, accents, countriesLoading, accentsLoading, countrySelected,
      accentSelected, accentIds } = this.props
    let header, body, menu, docTitle

    if (!countriesLoading && !accentsLoading && countrySelected) {
      docTitle = accentSelected
        ? accents.byId[accentSelected].name + ' - ' + countries.byId[countrySelected].name
        : countries.byId[countrySelected].name

      header = (
        <div className='mdl-card__title'>
          <img className='mdl-list__item-avatar'
            src={'/images/flags/' + countrySelected + '.svg'} />
          <h2 className='mdl-card__title-text'>
            { countries.byId[countrySelected].name }
          </h2>
        </div>
      )

      body = (
        <ul className='mdl-list'>
          { accentIds.map((id) => (
            <li key={id} className='mdl-list__item'>
              <div
                className={'eam-card__link' + (accentSelected === id ? ' eam-card__link--active' : '')}
                onClick={() => { this.selectAccent(id) }}>
                <span className='mdl-list__item-primary-content'>
                  {accents.byId[id].name}
                </span>
                <span className='mdl-list__item-secondary-action'>
                  <i className='material-icons'>play_circle_outline</i>
                </span>
              </div>
            </li>
            )
          ) }
        </ul>
      )

      menu = (
        <Link className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'
          to={'/'}>
          <i className='material-icons'>close</i>
        </Link>
      )
    } else {
      docTitle = null
      header = null

      body = (
        <div className='loading-indicator'>
          <div className='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active' />
        </div>
      )
      menu = null
    }

    return (
      <div>
        <DocumentTitle title={makeDocumentTitle(docTitle)} />
        <div className='eam-card eam-card--accents-list mdl-card mdl-shadow--8dp'>
          { header }
          <div className='mdl-card__supporting-text'>{ body }</div>
          <div className='mdl-card__menu'>{ menu }</div>
        </div>
      </div>
    )
  },

  propTypes: {
    params: React.PropTypes.object,
    countries: React.PropTypes.object,
    accents: React.PropTypes.object,
    accentIds: React.PropTypes.array,
    countriesLoading: React.PropTypes.bool,
    accentsLoading: React.PropTypes.bool,
    countrySelected: React.PropTypes.string,
    accentSelected: React.PropTypes.string,
    onSelectCountry: React.PropTypes.func,
    onSelectAccent: React.PropTypes.func
  }
})

export default AccentsList
