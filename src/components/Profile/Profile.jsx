import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Profile.module.scss'
import axios from "axios/index";
// import {Image} from 'semantic-ui-react/index'
import ReactStars from 'react-stars'
import Button from '@material-ui/core/Button/index';
import ProfilePosts from '../ProfilePosts/ProfilePosts'
import { withStyles } from '@material-ui/core/styles/index';
import NavBar from '../NavBar/NavBar'

const API_URL = "http://pet-gallery.herokuapp.com/api/";
class Profile extends Component{

    constructor(props){
        super(props);
        this.state = {
            id: '',
            name: "",
            location: "",
            ratings: 0,
            image: "",
            posts:[],
            featured: [],
            currentPanel: 'posts'
        }

        this.login = this.login.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.showFeatured = this.showFeatured.bind(this);
        this.showDiscussions = this.showDiscussions.bind(this);
        this.showPosts = this.showPosts.bind(this);
    }

    login(baseURL){
        // login
        axios.post(baseURL + 'login',{
            username : "raymondlx",
            password : "123456"
        })
            .then((response)=>{
                // console.log(response);
                window.localStorage.setItem('token',response.data.token);
            })
    }

    getUserInfo(baseURL, token){
        // get user info

        const config ={
            headers: {'Authorization': "bearer " + token}
        }

        axios.get(baseURL + 'user', config)
            .then((response)=>{
                const resData = response.data.data;
                console.log(resData)

                // calculate ratings
                const ratings = resData.ratings;
                let sum = 0;
                ratings.forEach((rating)=>{
                    sum += rating;
                });
                sum /= ratings.length;

                // update state
                this.setState({
                    id: resData._id, 
                    name:resData.name, 
                    location: resData.location, 
                    ratings: sum, 
                    image: resData.imageURL, 
                    posts: resData.petsCreated,
                    featured: resData.favoritedPets
                });
            })
    }

    getPosts(){

    }

    showFeatured() {
        this.setState({ currentPanel: 'featured' });
    }

    showPosts() {
        this.setState({ currentPanel: 'posts' });
    }

    showDiscussions() {
        this.setState({ currentPanel: 'discuss' });
    }

    componentDidMount() {
        window.localStorage.setItem('baseURL', API_URL);

        let token;
        // login adn get token
         this.login(API_URL);
        token = window.localStorage.getItem('token');

        // get user info
         this.getUserInfo(API_URL, token)
        // console.log(this.state.posts)
    }


    render(){
        const Avatar = {
            backgroundImage: `url(${this.state.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }

        return(
            <div>
                <NavBar expanded={false}/>
                <div className={styles.self}>
                    <div className={styles.description}>
                        <h1>{this.state.name}</h1>
                        <h2>{this.state.location}</h2>
                        <div className={styles.ratings}>
                            <ReactStars
                                value={this.state.ratings}
                                size={25}
                                edit={false}
                            />
                            <p>{this.state.ratings}</p>
                        </div>

                    </div>

                    <div className={styles.imgContainer}>
                        <img style={Avatar} />
                    </div>
                </div>

                <div className={styles.buttonGroup}>

                    <Button size="large" variant="outlined" color="primary" onClick={this.showFeatured} >
                        Featured
                    </Button>
                    <Button size="large" variant="outlined" color="primary" onClick={this.showPosts}>
                        Posts
                    </Button>
                    <Button size="large" variant="outlined" color="primary" onClick={this.showDiscussions}>
                        Discussion
                    </Button>
                </div>

                {this.state.currentPanel === 'posts' ?
                    <ProfilePosts
                        userId = {this.state.id}
                        posts = {this.state.posts}
                        isFeatured={false}>
                    </ProfilePosts>
                : this.state.currentPanel === 'featured' ? 
                    <ProfilePosts
                        userId = {this.state.id}
                        posts = {this.state.featured}
                        isFeatured={true}>
                    </ProfilePosts>
                : <div></div>}
            </div>
        );
    }
}


export default Profile