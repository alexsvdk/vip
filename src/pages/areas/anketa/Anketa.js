
import React from 'react';
import PropTypes from 'prop-types';

import s from './Anketa.module.scss';
import SmartImage from "../../../images/SmartImage";
import Widget from "../../../components/Widget";
import config from "../../../config";
import Select from 'react-select'
import {toast} from "react-toastify";
import ImageUploader from 'react-images-upload';

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

  options = [
    { value: 'red', label: 'Красный' },
    { value: 'yellow', label: 'Желтый' },
    { value: 'green', label: 'Зеленый' }
  ]

  static defaultProps = {
    location: {},
    updateLoc: (l) => {}
  };

  defstate = {
    _id:"",
    active:false,
    addr:"",
    calan:false,
    ceiling:"",
    cleanning:false,
    cold:false,
    comments:[],
    conditioner:false,
    contact_name:"",
    date:"",
    description:"",
    electricity_increase:false,
    finder_tid:0,
    fire_alarm:false,
    floor:"",
    floorType:"",
    free_plan:false,
    g_place_id:"",
    hot:false,
    label:"",
    last_call:"",
    lat:"",
    lights:"",
    lng:"",
    parking:false,
    percent:"",
    phones:[],
    pic_ids:[],
    power:"",
    price:"",
    secure_parking:false,
    securety:false,
    showcase:false,
    split_system:false,
    square:"",
    sub_arend:false,
    tech_canal:false,
    walls:"",
    went:false,
    windows:false,
  }

  state = this.defstate



  componentDidMount() {
    this.setState({...this.defstate, ...this.props.location, raw: this.props.location})
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.location._id !== this.state._id) {
      const obj = nextProps.location
      for (const prop in obj) {
        if (obj[prop] === null)
          obj[prop] = this.defstate[prop]
      }
      this.setState({...obj, raw: obj});
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

  doDelete = () => {
    const location = this.state
    location.last_call = new Date().getTime()
    //todo exclude raw
    const cfg = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem("id_token")
      },
      credentials: 'include',
    };

    fetch(config.baseURLApi + '/location/'+location._id, cfg).then((res) =>
        toast.success('Успешно удалено', {
          position: "bottom-right",
          autoClose: 5000
        })
    ).catch(e => console.log(e))

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

  onDrop = (pictureFiles, pictureDataURLs) => {
    const token = localStorage.getItem('id_token')
    pictureFiles.forEach(pic => {
      const formData = new FormData()
      formData.append('file',pic)
      const request = {
        method: 'POST',
        headers: {
          'Auth': token,
        },
        body: formData
      }
      fetch(config.baseURLApi+'/pic/upload', request).then(res => res.json()).then(json => {
        const ids = this.state.public_pics
        ids.push(json.name)
        this.setState({public_pics: ids})
      })
    })
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
          <form className={s.mainForm} onSubmit={this.doSave}>
            <p>Дата добавления: {this.parseDate(this.state.date)}</p>
            <p>Дата последнего звонка: {this.state.last_call > 0 ? this.parseDate(this.state.last_call) : "Никогда"}</p>

            <p>Секрентное фото</p>
            <SmartImage id={this.state.pic_ids[0]} width={500}/>

            <p>Публичные фото</p>
            <ImageUploader
                withIcon={true}
                buttonText='Загрузить фото'
                onChange={this.onDrop}
                imgExtension={['.jpg']}
            />
            <Button onClick={this.doUpload}>Загрузить</Button>

            <Button href={'https://maps.google.com/maps?q=' + this.state.lat + ',' + this.state.lng} target="_blank">
              Показать на карте </Button>

            <br/>
            <br/>

            <Select
                value={this.options.filter(option => option.value === this.state.label)}
                options={this.options}
                onChange={t => this.setState({label: t.value})}
            />

            <label className={s.llabel} htmlFor="name">Номер телефона
              <Badge color="secondary" className="ml-xs">{this.state.phones.length}</Badge>
            </label>
            <input className={s.linput} type="text"
                   value={this.state.phones.length > 0 && Array.prototype.reduce.call(this.state.phones, (acc, name) => acc + ", " + name)}
                   onChange={(val) => this.setState({phones: val.target.value.split(", ")})}/>
            <br/>

            <label className={s.llabel} htmlFor="name">Контактное лицо</label>
            <input className={s.linput} type="text" value={this.state.contact_name} onChange={(val) => this.setState({contact_name: val.target.value})}/>
            <br/>

            <label className={s.llabel} htmlFor="name">Адрес</label>
            <input className={s.linput} type="text" value={this.state.addr} onChange={(val) => this.setState({addr: val.target.value})}/>
            <br/>

            <label className={s.llabel} htmlFor="name">Этаж</label>
            <input className={s.linput} type="text" value={this.state.raw.floor} onChange={(val) => {
              this.state.raw.floor = val.target.value
              if (this.isInt(val.target.value))
                this.setState({floor: parseInt(val.target.value)})
              else this.forceUpdate()
            }}/>
            {!this.isInt(this.state.raw.floor) && <Alert color="danger">Введите корректное число</Alert>}
            <br/>

            <label className={s.llabel} htmlFor="name">Квадратура</label>
            <input className={s.linput} type="text" value={this.state.raw.square} onChange={(val) => {
              this.state.raw.square = val.target.value
              if (this.isInt(val.target.value))
                this.setState({square: parseFloat(val.target.value)})
              else this.forceUpdate()
            }}/>
            {!this.isFloat(this.state.raw.square) && <Alert color="danger">Введите корректное число</Alert>}
            <br/>

            <label className={s.llabel} htmlFor="name">Арендная ставка</label>
            <input className={s.linput} type="text" value={this.state.raw.price} onChange={(val) => {
              this.state.raw.price = val.target.value
              if (this.isInt(val.target.value))
                this.setState({price: parseInt(val.target.value)})
              else this.forceUpdate()
            }}/>
            {!this.isInt(this.state.raw.price) && <Alert color="danger">Введите корректное число</Alert>}
            <br/>

            <label className={s.llabel} htmlFor="name">Процент</label>
            <input className={s.linput} type="text" value={this.state.raw.percent} onChange={(val) => {
              this.state.raw.percent = val.target.value
              if (this.isInt(val.target.value))
                this.setState({percent: parseInt(val.target.value)})
              else this.forceUpdate()
            }}/>
            {!this.isInt(this.state.raw.percent) && <Alert color="danger">Введите корректное число</Alert>}
            <br/>

            <label className={s.llabel} htmlFor="name">Электрическая мощность</label>
            <input className={s.linput} type="text" value={this.state.raw.power} onChange={(val) => {
              this.state.raw.power = val.target.value
              if (this.isInt(val.target.value))
                this.setState({power: parseInt(val.target.value)})
              else this.forceUpdate()
            }}/>
            {!this.isInt(this.state.raw.power) && <Alert color="danger">Введите корректное число</Alert>}
            <br/>


            <label htmlFor="name">Дополнительная информация</label>
            <Checkbox
                label="Суб аренда"
                checked={this.state.sub_arend}
                onChange={(v)=>this.setState({sub_arend: v})}
            />
            <Checkbox
                label="свободная планировка"
                checked={this.state.free_plan}
                onChange={(v)=>this.setState({free_plan: v})}
            />
            <Checkbox
                label="Возможно ли увеличение электрический мощности"
                checked={this.state.electricity_increase}
                onChange={(v)=>this.setState({electricity_increase: v})}
            />
            <Checkbox
                label="Водоснабжение горячее "
                checked={this.state.hot}
                onChange={(v)=>this.setState({hot: v})}
            />
            <Checkbox
                label="Водоснабжение холодное"
                checked={this.state.cold}
                onChange={(v)=>this.setState({cold: v})}
            />
            <Checkbox
                label="Канализация "
                checked={this.state.calan}
                onChange={(v)=>this.setState({calan: v})}
            />
            <Checkbox
                label="Техническая канализация"
                checked={this.state.htech_canalot}
                onChange={(v)=>this.setState({tech_canal: v})}
            />
            <Checkbox
                label="Окна"
                checked={this.state.windows}
                onChange={(v)=>this.setState({windows: v})}
            />
            <Checkbox
                label="Витрина"
                checked={this.state.showcase}
                onChange={(v)=>this.setState({showcase: v})}
            />
            <Checkbox
                label="Кондиционирование"
                checked={this.state.conditioner}
                onChange={(v)=>this.setState({conditioner: v})}
            />
            <Checkbox
                label="Вентиляция"
                checked={this.state.went}
                onChange={(v)=>this.setState({went: v})}
            />
            <Checkbox
                label="Сплит система"
                checked={this.state.split_system}
                onChange={(v)=>this.setState({split_system: v})}
            />
            <Checkbox
                label="Пожарная сигнализация "
                checked={this.state.fire_alarm}
                onChange={(v)=>this.setState({fire_alarm: v})}
            />
            <Checkbox
                label="Осуществляется ли клининг "
                checked={this.state.cleanning}
                onChange={(v)=>this.setState({cleanning: v})}
            />
            <Checkbox
                label="Охрана/охранная сигнализация "
                checked={this.state.securety}
                onChange={(v)=>this.setState({securety: v})}
            />
            <Checkbox
                label="Наличие парковки"
                checked={this.state.parking}
                onChange={(v)=>this.setState({parking: v})}
            />
            <Checkbox
                label="Охраняемая парковка"
                checked={this.state.secure_parking}
                onChange={(v)=>this.setState({secure_parking: v})}
            />

            <br/>
            <h2>Интериер</h2>
            <br/>

            <label className={s.llabel} htmlFor="name">Какие полы</label>
            <input className={s.linput} type="text" value={this.state.floorType}
                   onChange={(val) => this.setState({floorType: val.target.value})}
            />
            <br/>

            <label className={s.llabel} htmlFor="name">Какие стены</label>
            <input className={s.linput} type="text" value={this.state.walls}
                   onChange={(val) => this.setState({walls: val.target.value})}
            />
            <br/>

            <label className={s.llabel} htmlFor="name">Какой потолок</label>
            <input className={s.linput} type="text" value={this.state.ceiling}
                   onChange={(val) => this.setState({ceiling: val.target.value})}
            />
            <br/>

            <label className={s.llabel} htmlFor="name">Какое освещение</label>
            <input className={s.linput} type="text" value={this.state.lights}
                   onChange={(val) => this.setState({lights: val.target.walls})}
            />
            <br/>

            <label className={s.llabel} htmlFor="name">Комментарии</label>
            <ul>
              {this.state.comments.map(comment => <li key={comment}>
                    {comment}
                  </li>
              )}
            </ul>
            <input className={s.linput} type="text" value={this.state.comment}
                   onChange={(val) => this.setState({comment: val.target.value})}/>
            <input type="button" value="Добавить комментарий" onClick={() => {
              if (this.state.comment !== "")
                this.setState({
                  comments: this.arradd(this.state.comments, this.state.comment),
                  comment: ""
                })
            }}/>
            <br/>

            <label className={s.llabel} htmlFor="name">Описание</label>
            <p>(Для pdf)</p>
            <input className={s.inputbig} type="text" value={this.state.description} onChange={(val) => this.setState({description: val.target.value})}/>
            <br/>

            <Button color="success" action="submit">Сохранить</Button>
            <Button color="secondary" target="_blank" href={"http://vipagenty.ru/loc/"+this.state._id+"/"+localStorage.getItem("id")}>PDF</Button>
            <Button color="danger" onClick={this.doDelete}>Удалить</Button>
          </form>
          }

        </Widget>
    );
  }
}

export default Anketa;
