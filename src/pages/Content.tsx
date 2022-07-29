import { useRef,useState,useEffect } from "react"
import { FaSearch } from "react-icons/fa"
import Photos from "../components/Photos"

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

const Content = () => {
    const [loading, setLoading] = useState(false)
    const [photos, setPhotos] = useState([])
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [newImages, setNewImages] = useState(false)
    const mounted = useRef(false)
    
    const getImages = async () => {
        setLoading(true)
        let url;
        const urlPage = `&page=${page}`
        const urlQuery = `&page=${query}`
        if (query) {
            url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
        } else {
            url = `${mainUrl}${clientID}${urlPage}`
        }
        try {
            const res = await fetch(url)
            const data = await res.json()
            console.log(data);
            setPhotos((oldPhotos) => {
                if (query && page === 1) {
                    return data.results;
                } else if (query) {
                    return [...oldPhotos, ...data.results]
                } else {
                    return [...oldPhotos, ...data]
                }
            });
            setNewImages(false)
            setLoading(false)
        } catch(error) {
            setNewImages(false)
            setLoading(false)
        }
    }
    useEffect(() => {
        getImages()
    }, [page])
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            return;
        }
        if (!newImages) return;
        if (loading) return;
        setPage((oldPage) => {
            return oldPage + 1;
        })
    }, [newImages])
    const event = () => {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
            setNewImages(true)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', event)
        return () => window.removeEventListener('scroll', event)
    }, [])
    const handleSubmit = (e:any) => {
        e.preventDefault()
        if (!query) return;
        if (page === 1) {
            getImages()
        }
        setPage(1)
    }
    return (
        <main>
            <section>
                <form action="">
                    <input placeholder="search" onChange={(e) => setQuery(e.target.value)} className="" value={query} type="text" />
                    <button type="submit" onClick={handleSubmit}>
                        <FaSearch />
                    </button>
                </form>
            </section>
            <section className="photos">
                <div>
                    {photos.map((image:any, index) => {
                        return <Photos key={index} {...image} />
                    })}
                </div>
                {loading && <h2 className="loading">loading...</h2>}
            </section>
        </main>
    )
}

export default Content