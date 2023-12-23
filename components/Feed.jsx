"use client"

import { useState, useEffect } from "react"

import PromptCard from "./PromptCard"

const PromptCardList = ({data,handleTagClick}) => {
  return(
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post.id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [posts, setPosts] = useState([])

  // Seacrh States
  const [searchText,setSearchText] = useState('')
  const [searchTimeout,setSearchTimeout] = useState(null)
  const [searchedResults,setSearchedResults] = useState([])

  useEffect(()=>{
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt',{
        method: 'GET',
        headers: {
          'Cache-Control': 'no-store'
        }
      })
      const data = await response.json()
      
      setPosts(data)
    }
    fetchPosts()
  },[])
  
  const filterPrompt = (searchText) =>{
    const regex = new RegExp(searchText,"i") // "i" flag for case-insensitive search
    
    return posts.filter((item)=>
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt) 
    ) 
  }
  
  const handlerSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    setSearchTimeout(setTimeout(()=>{
      const searchResult = filterPrompt(e.target.value)
      setSearchedResults(searchResult)
    },500))
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)

    const searchResult = filterPrompt(tagName)
    setSearchedResults(searchResult)
  }

  return (
    <section className="feed">
      <form className="relative w-4/5 flex-center">
        <input 
          type="text" 
          placeholder="Serach for a tag or a username"
          value={searchText}
          onChange={handlerSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList
          data = {searchedResults}
          handleTagClick = {handleTagClick}
        />
      ) : (
        <PromptCardList
          data = {posts}
          handleTagClick = {handleTagClick}
        />
      )} 
      
    </section>
  )
}

export default Feed