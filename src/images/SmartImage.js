import React from 'react'
import PropTypes from "prop-types";
import appConfig from "../config";

export default class SmartImage extends React.Component{

    static propTypes = {
        id: PropTypes.string,
        alt: PropTypes.string
    };

    static defaultProps = {
        alt: ""
    }

    state = {
        img: null
    }

    fetchImg(id){
        const cfg = {
            method: 'GET',
            headers: {'Auth': localStorage.getItem("id_token")},
            credentials: 'include',
            mode: 'cors',
            cache: 'default',
        };

        fetch(appConfig.baseURLApi+'/pic/'+id,cfg)
            .then(response => response.blob())
            .then(myBlob => {
                const objectURL = URL.createObjectURL(myBlob);
                this.setState({img: objectURL})
            })
    }

    componentDidMount() {
        this.fetchImg(this.props.id)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.id!==nextProps.id)
            this.fetchImg(nextProps.id)
    }

    render() {
        return <img {...this.props} src={this.state.img}/>
    }
}