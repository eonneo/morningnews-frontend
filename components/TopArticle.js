import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/TopArticle.module.css';

function TopArticle(props) {
  const dispatch = useDispatch();
  //get the value from user reducer
  const user = useSelector((state) => state.user.value);

  //when click on bookrmak icon
  const handleBookmarkClick = () => {
    //check if connected
    if (!user.token) {
      return;
    }

    //check if bookmark is possible
    fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result && data.canBookmark) {
          //check if already bookmarked -> then remove bookmark
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
            //if not -> bookmark
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  }

  //define icon color for bookmarked top article
  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { 'color': '#E9BE59' };
  }

  return (
    <div className={styles.topContainer}>
      <img src={props.urlToImage} className={styles.image} alt={props.title} />
      <div className={styles.topText}>
        <h2 className={styles.topTitle}>{props.title}</h2>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        <h4>{props.author}</h4>
        <p>{props.description}</p>
      </div>
    </div>
  );
}

export default TopArticle;
