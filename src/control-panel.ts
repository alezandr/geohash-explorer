// Copyright 2019 Alexander Berezovsky
// License: http://opensource.org/licenses/MIT

import * as R from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import Popover, { PopoverProps } from 'react-tiny-popover'
import * as Utils from './utils'

interface ControlPanelProps {
    geohash: string
    pageUrl?: string
    onGeohashChanged?: (string) => void
    onGeohashSubmited?: (string) => void
}

class ControlPanel extends R.Component<RouteComponentProps<any> & ControlPanelProps> {

    private inputListener: (evt: R.FormEvent) => void
    private submitListener: (evt: R.FormEvent) => void
    private inputElem: HTMLElement

    constructor(props, context) {
        super(props, context)

        const listenValue = ((func: Function) => (evt: R.FormEvent) => {
            evt.preventDefault()
            func.call(this, evt.target['value'])
        }).bind(this)

        this.inputListener = listenValue(this.props.onGeohashChanged)
        this.submitListener = listenValue(this.props.onGeohashSubmited)
    }

    componentDidMount() {
        this.inputElem.focus()
    }

    componentDidUpdate() {
        this.inputElem.focus()
    }

    render() {
        const geohash = this.props.geohash
        const geohashVlidationResults = Utils.validateGeohash(geohash.toLowerCase())

        let inputFieldClassName = ''
        let errorPopupClassName = ''
        let errorPopupText = ''

        switch (geohashVlidationResults.status) {
            case 'success':
                inputFieldClassName = 'geohash-search__input'
                break;
            case 'error':
                inputFieldClassName = 'geohash-search__input geohash-search__input--error'
                errorPopupClassName = 'geohash-search__error-message'
                errorPopupText = `The character '${geohash[geohashVlidationResults.index]}' not belongs to geohash`
                break;
        }

        const popoverProps = {
            isOpen: geohashVlidationResults.status === 'error',
            position: 'bottom',
            padding: 0,
            containerStyle: { zIndex: 10000 },
            content: ({ position, targetRect, popoverRect }) => {
                const modifier = errorPopupClassName + '--' + position
                return R.createElement('div', { className: errorPopupClassName + ' ' + modifier }, errorPopupText)
            }
        }

        return R.createElement('form', { className: 'geohash-search', onSubmit: this.submitListener },
            R.createElement(Popover, <PopoverProps><any>popoverProps,
                R.createElement('input', {
                    className: inputFieldClassName,
                    ref: (elem) => this.inputElem = elem,
                    type: 'text',
                    autoFocus: true,
                    spellCheck: false,
                    placeholder: '',
                    onChange: (evt) => { this.inputListener(evt) },
                    value: geohash
                }),
                R.createElement('input', { type: 'submit', className: 'geohash-search__go-button', value: 'Go' })
            )
        )
    }
}

export default withRouter(ControlPanel)