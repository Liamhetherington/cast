import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Auth0Provider } from '@auth0/auth0-react'

import Header from './components/Header'
import PodcastRow from './components/PodcastRow'
import Episode from './components/Episode'
import { Login } from "./components/Login/Login"
import { Register } from "./components/Login/Register"

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [podcasts, setPodcasts] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [selectedPodcast, setSelectedPodcast] = useState(null)

  // const episodes = [
  //   { id: 0, title:'Track 1', artist:'artist 1', image:'images/img_1.jpg', trackUrl:'http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88'},
  //   { id: 1, title:'Track 2', artist:'artist 1', image:'images/img_2.jpg', trackUrl:'http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88'},
  //   { id: 2, title:'Track 3', artist:'artist 1', image:'images/img_3.jpg', trackUrl:'http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88'},
  //   { id: 3, title:'Track 4', artist:'artist 1', image:'images/img_4.jpg', trackUrl:'http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88'},
  //   { id: 4, title:'Track 5', artist:'artist 1', image:'images/img_5.jpg', trackUrl:'http://hwcdn.libsyn.com/p/e/2/d/e2d49676d65218ec/p1541a.mp3?c_id=84308228&cs_id=84308228&expiration=1601254668&hwt=ccab3206052417d0e901722ab00c9c88'},
  // ]

  const onInputTyped = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

  const onSearchBtnClicked = (event) => {
    
    axios ({ 
      url: '/search',
      method: 'post',
      data: {
        term: searchTerm.trim().toLocaleLowerCase()
      },
      options: {
        headers: {Accept: 'application/json'}
      }
    })
      .then(({ data }) => {
      setPodcasts(data.podcasts)
      // console.log('PODCAST: ' + JSON.stringify(data))
    })
    .catch(err => {

    }) 
  }

  const selectPodcast = (podcast, event) => {
    event.preventDefault();
    console.log('selected podcast: ' + JSON.stringify(podcast))
    setSelectedPodcast(podcast)
  }

  useEffect(() => {
    console.log('SELECTED PODCAST CHANGED: ' + JSON.stringify(selectedPodcast))
    if (!selectedPodcast)
      return
    const url = `/feed?url=${selectedPodcast.feed}`
    axios({
      url,
      method: 'get',
    })
      .then(({ data }) => {
        console.log('CHANGED PODCAST')
        const { item } = data
        const tracks = item.map((t, index) => {
          return {
            id: index,
            title: t.title[0],
            image: selectedPodcast.image,
            trackUrl: t.enclosure[0]['$'].url
          }
        })

        setEpisodes(tracks)
      })
      .catch(err => {
      
      })
  }, [selectedPodcast])



  return(
    <div className="site-wrap">
      {/* <Header /> */}
      <Header />

      <div className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="featured-user  mb-5 mb-lg-0">
                <h3 className="mb-2">Search Podcasts</h3>
                <div style={{display: "flex"}}>
                  <input onChange={onInputTyped} type="text" style={{height: "32px"}} className="form-control mb-4" />
                  <button onClick={onSearchBtnClicked} className="btn btn-info p-1 ml-2" style={{height: 32}}>GO!</button>
                </div>
                <ul className="list-unstyled">
                  {podcasts.map(podcast => <PodcastRow key={podcast.id} {...podcast} onSelect={(e) => selectPodcast(podcast, e)}/> )}
                </ul>
              </div>
            </div>

            <div className="col-lg-9">
              {episodes.map(episode => <Episode key={episode.id} {...episode}/> )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(
  <Auth0Provider
    domain="dev-rh3uil8y.us.auth0.com"
    clientId="tve8q4ZZ00Trej3Gsmep0vWacS7x4b6K"
    redirectUri={window.location.origin}>
    <App />
  </Auth0Provider>,
  document.getElementById('root')
)