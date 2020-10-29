import React, { Component } from 'react';
import {
  Row,
  Col,
  Table,
  Progress,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import Select from 'react-select'

import Widget from '../../components/Widget';
import s from './Static.module.scss';
import config from "../../config";
import Anketa from "./anketa";

class Tetants extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      currLocation: null,
      search: {}
    };

    this.fetchLocations.bind(this)
  }

  onLocationUpdated = (location) => {
    const locations = this.state.locations
    locations[locations.indexOf(this.state.currLocation)] = location
    this.setState({locations: locations, currLocation: location})
    this.forceUpdate()
  }

  fetchLocations(clearoffset){
    const token = localStorage.getItem('id_token')
    const cfg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({token, body: {...this.state.search, offset: clearoffset? 0: this.state.locations.length}}),
    };

    fetch(config.baseURLApi + '/tetants', cfg).then((res) => res.json()).then(json => {
      if (json.code===200)
        this.setState({ locations: this.state.locations.concat(json.body) })
      else
        window.location.replace("/#/login")
    })
  }


  doSearch = () => {
    this.setState({locations: []})
    this.fetchLocations(true)
  }

  componentDidMount() {
    this.fetchLocations()
  }


  render() {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>АГЕНТЫ ВИП</BreadcrumbItem>
          <BreadcrumbItem active>Площади</BreadcrumbItem>
        </Breadcrumb>

        <div className={s.searchForm}>

          <div className={s.block}>
            <label>Поиск</label>
            <input type="text" onChange={v => this.setState({search: {...this.state.search, q: v.target.value}})}/>
          </div>

          <div className={s.block+' '+s.mini}>
            <label>От</label>
            <input type="text" onChange={v => this.setState({search: {...this.state.search, smin: parseInt(v.target.value)}})}/>
          </div>

          <div className={s.block+' '+s.mini}>
            <label>До</label>
            <input type="text" onChange={v => this.setState({search: {...this.state.search, smax: parseInt(v.target.value)}})}/>
          </div>

          <Button
              className={s.block}
              onClick={this.doSearch}
          >
            Найти
          </Button>

          <Button
              className={s.block}
              onClick={() => {
                this.setState({search: {}});
                this.doSearch(true)}
              }
          >
            Сброс
          </Button>
        </div>

        <h1 className="page-title mb-lg">Площади - <span className="fw-semi-bold">Арендаторы</span></h1>
        <Row>
          <Col sm={5}>
              <Widget
                  title={<h5>
                    Список <span className="fw-semi-bold">Помещений</span>
                  </h5>} settings close
              >
                <Table  borderless className={s.mainTable}>
                  <thead>
                  <tr>
                    <th>Название</th>
                    <th className="hidden-sm-down">Желаемая площадь</th>
                    <th />
                  </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.locations.map(row => {

                            return <tr className={this.state.currLocation && this.state.currLocation === row && s.selected}
                                       key={row._id}
                                       onClick={() => this.showLocation(row._id)}

                            >
                              <td>
                                {row.title}
                              </td>
                              <td className="text-semi-muted">
                                {row.square_min+"-"+row.square_max}
                              </td>
                            </tr>
                          }
                      )
                    }
                    </tbody>
                </Table>
                <Button color="primary" className="w-100" onClick={()=>this.fetchLocations()}>Загрузить еще</Button>
                <Button color="secondary" className="w-100" onClick={()=>{
                  this.setState({locations: [...this.state.locations, {}]});
                  this.setState({currLocation: this.state.locations[this.state.locations.length]})
                }}>Создать помещение</Button>
              </Widget>
          </Col>

          <Col sm={7}>
            {this.state.currLocation && <Anketa location={this.state.currLocation} updateLoc={this.onLocationUpdated}/>}
          </Col>
        </Row>
      </div>
    );
  }

  showLocation(_id) {
    this.setState({currLocation: this.state.locations.find(location => location._id === _id)})
  }
}

export default Tetants;
