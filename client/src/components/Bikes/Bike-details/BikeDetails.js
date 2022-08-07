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
    const { userData } = useContext(AuthContext);
    const { id } = useParams();

    const [currentComents, setCurrentComments] = useState([]);
    const [bikeInfo, setBikeInfo] = useState({});

    useEffect(() => {
        bikeService.getOne(id)
            .then(data => setBikeInfo(data));
    }, []);

    const token = userData.accessToken;
    commentService.createComment(token, {});

    const addCommentHandler = (e) => {

        e.preventDefault();
        const comentData = new FormData(e.target);
        const comment = comentData.get('comment');
        const data = {
            gameId: id,
            author: userData.email,
            comment: comment
        }

        commentService.createComment(token, data)
            .then(result => {
                setCurrentComments(state => [
                    ...state,
                    result
                ])
            })
            .catch((err) => {
                console.log(err);
            })
        e.target.children[0].value = '';
    }

    const deletBikeAd = () => {
        const token = userData.accessToken;
        bikeService.removeAd(token, bikeInfo._id);
        emptyBikeState(bikeInfo._id);
        navigate('/myAds');
    }

    useEffect(() => {
        commentService.getAllComments()
            .then(res => setCurrentComments(res))
    }, []);

    return (
        <div className='MainSectionForDetails'>

            <div className='ImageContainer'>
                <img className='Container' src={bikeInfo.imageUrl} alt={'Not found'}></img>
            </div>

            <div className='TextContainter'>
                <h1 className='BrandName'>{bikeInfo.brand}</h1>
                <h2>Size: {bikeInfo.frame}</h2>
                <h2>Wheels size: {bikeInfo.wheelSize}</h2>
                <h2>Price: ${bikeInfo.price}</h2>
                <h4 >Description :</h4>
                <p className='DescriptionParagraph'>{bikeInfo.description}</p>
                <h3> Owner's phone: {bikeInfo.phone}</h3>

                {(userData._id === bikeInfo._ownerId)
                    && <div>
                        <Link to={`/bikes/${bikeInfo._id}/edit`} state={{ bikeInfo: bikeInfo }} className="OptionButtons" >EDIT</Link>
                        <button onClick={deletBikeAd} className='OptionButtons'>DELETE</button>

                    </div>
                }
            </div>

            <div className="CommentsSection">
                <h2>Comments:</h2>

                <ul >

                    {(currentComents?.map(x => bikeInfo._id === x.gameId
                        && <li className="Comment" key={x._id}>
                            <h3 className="AuthourSection" >{x.author}:</h3>
                            <p className="ParagraphComment">{x.comment}</p>
                        </li>))
                        || (<h1>No comments</h1>)

                    }
                </ul>
            </div>
            {userData.accessToken ?
                <div className="MainCommentSection">

                    <form onSubmit={addCommentHandler}>
                        <input
                            className="TextArea"
                            name='comment'
                            placeholder="Add new comment.."
                        >
                        </input>
                        <button
                            className="AddCommentBtn"
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







