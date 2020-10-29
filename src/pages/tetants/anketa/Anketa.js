/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import s from './Anketa.module.scss';
import SmartImage from "../../../images/SmartImage";
import Widget from "../../../components/Widget";
import config from "../../../config";
import Select from 'react-select'
import {toast} from "react-toastify";

import {
  Button,
  Badge,
} from 'reactstrap';
import Alert from "reactstrap/lib/Alert";
import Checkbox from "../Checkbox";

class Anketa extends React.Component {

  constructor(props) {
    super(props);
    this.parseDate = Anketa.parseDate
    this.arradd = Anketa.arradd
  }
  static propTypes = {
    location: PropTypes.object,
    updateLoc: PropTypes.func
  };

  static defaultProps = {
    location: {},
    updateLoc: (l) => {}
  };

  state = {}



  componentDidMount() {
    this.setState(this.props.location);
    this.setState({raw: this.props.location})
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.location._id !== this.state._id) {
      this.setState({})
      this.setState(nextProps.location);
      this.setState({raw: nextProps.location})
    }
  }

  static parseDate(date){
    const d = new Date(date)
    return d.toLocaleString()
  }

  static arradd(arr, val){
    arr.push(val)
    return arr
  }

  doSave = (f) => {
    const location = this.state
    location.last_call = new Date().getTime()
    //todo exclude raw
    const cfg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({token: localStorage.getItem("id_token"), body: location}),
    };

    fetch(config.baseURLApi + '/updateLocation', cfg).then((res) => res.json()).then(json => {
      if (json.code===200) {
        toast.success('Успешно сохранено', {
          position: "bottom-right",
          autoClose: 5000
        });
        this.props.updateLoc(location);
      }
      else
        toast.error(json.body.error, {
          position: "bottom-right",
          autoClose: 5000
        });
    }).catch(e => console.log(e))
    f.preventDefault()
  }

  isFloat(f){
    try{
      f = parseFloat(f)
      if (!isNaN(f))
        return true
    }catch (e) {}
    return false
  }

  isInt(f){
    try{
      f = parseInt(f)
      if (!isNaN(f))
        return true
    }catch (e) {}
    return false
  }


  render() {
    return (
        <Widget
            title={<h5>
              {this.state.addr}
            </h5>} settings close
        >
          <br/>
          {this.state.raw &&
              <div>
                <img width={150} src={"https://shopandmall.ru"+this.state.logourl}/>
                <h1>{this.state.title}</h1>
                <p>Страна: {this.state.country}</p>
                <p>Планы: {this.state.plans}</p>
                <p>Ценовой сегмент: {this.state.price_tag}</p>
                <p>Количество в мире: {this.state.amount}</p>
                <p>Количество в России: {this.state.amount_ru}</p>
                <p>Представлен в регионах: {JSON.stringify(this.state.regions)}</p>
                <p>Площадь : {this.state.square_min}-{this.state.square_max}</p>
                <h1>Контакты</h1>
                {this.state.contacts.map(c=> <div>
                  <br/>
                  <h5>Имя: {c.name}</h5>
                  <p>Должность: {c.position}</p>
                  <p>Email: {c.email}</p>
                  <p>Телефон: {c.phone}</p>
                  <p>Сайт: {c.site}</p>
                </div>)}
              </div>
          }
        </Widget>
    );
  }
}

export default Anketa;
