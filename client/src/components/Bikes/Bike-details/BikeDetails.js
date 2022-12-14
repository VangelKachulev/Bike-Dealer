import "./bikeDetails.css";
import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import * as bikeService from '../../../services/BikeService';
import * as commentService from '../../../services/CommentService'
import { AuthContext } from '../../../contexts/AuthContext';
import { BikeContext } from '../../../contexts/BikeContext';

export const BikeDetails = () => {

    const navigate = useNavigate();
    const { emptyBikeState } = useContext(BikeContext);
    const { token, userData } = useContext(AuthContext);
    const { id } = useParams();

    const [currentComents, setCurrentComments] = useState([]);
    const [bikeInfo, setBikeInfo] = useState({});
    const [commentInput, setCommentInput] = useState({
        comment: ''
    });

    useEffect(() => {
        bikeService.getOne(id)
            .then(data => setBikeInfo(data))
            .catch(() => {
                navigate('/404');
                return
            })

        commentService.getAllComments()
            .then(res => setCurrentComments(Object.values(res)))
            .catch(() => {
                navigate('/404');
                return
            })

    }, []);

    const onCommentChange = e => {
        setCommentInput(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const addCommentHandler = (e) => {

        e.preventDefault();
        const data = {
            bikeId: id,
            author: userData.email,
            comment: commentInput.comment
        };

        commentService.createComment(token, data)
            .then(result => {
                setCurrentComments(state => [
                    ...state,
                    result
                ]);
            });

        commentInput.comment = '';
    };

    const deletBikeAd = () => {
        const confirmation = window.confirm('Are you sure you want to delete this ad?');
        if (confirmation) {
            bikeService.removeAd(token, bikeInfo._id);
            emptyBikeState(bikeInfo._id);
            navigate('/myAds');
        };
    };

    return (
        <div className='details-main'>
            <div className="content">
                <div className='details-image-container'>
                    <img src={bikeInfo.imageUrl} alt={'Not found'}></img>
                </div>

                <div className='details-data'>

                    <h1 >{bikeInfo.brand}</h1>
                    <h2>Size: {bikeInfo.frame}</h2>
                    <h2>Wheels size: {bikeInfo.wheelSize}</h2>
                    <h2>Price: ${bikeInfo.price}</h2>
                    <h4 >Description :</h4>
                    <p>{bikeInfo.description}</p>
                    <h3> Owner's phone: {bikeInfo.phone}</h3>

                    {(userData._id === bikeInfo._ownerId)
                        && <div className="owner-btn">
                            <Link to={`/bikes/${bikeInfo._id}/edit`} state={{ bikeInfo: bikeInfo }} className="details-buttons">EDIT</Link>
                            <button onClick={deletBikeAd} className='details-buttons'>DELETE</button>

                        </div>
                    }
                </div>


            </div>

            <div className="comment-section">
                <h2 className="comment-section-title">Comments:</h2>

                <ul>

                    {(currentComents?.map(x => bikeInfo._id === x.bikeId
                        && <li className="single-comment" key={x._id}>
                            <h3 className="author" >{x.author}:</h3>
                            <p className="comment">{x.comment}</p>
                        </li>))
                        || (<h1>No comments</h1>)

                    }
                </ul>
            </div>

            {userData.accessToken ?
                <div className="main-comment-section">

                    <form onSubmit={addCommentHandler}>
                        <input
                            className="text-area"
                            name='comment'
                            placeholder="Add new comment.."
                            onChange={onCommentChange}
                            value={commentInput.comment}
                        >
                        </input>
                        <button

                            disabled={!commentInput.comment}
                            className="add-comment"
                            type="submit"
                            value='Add comment'> Comment
                        </button>
                    </form>
                </div>
                : null
            }

        </div >
    )
}








