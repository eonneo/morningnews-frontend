import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle } from '../reducers/hiddenArticles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import styles from '../styles/Article.module.css';

function Article(props) {
  const dispatch = useDispatch();
  //get the value from user reducer
  const user = useSelector((state) => state.user.value);

  const handleBookmarkClick = () => {
    //check token
    if (!user.token) {
      return;
    }
    //fetch DB with token to know if bookmark is allowed
    fetch(`https://morningnews-backend.vercel.app/users/canBookmark/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result && data.canBookmark) {
          //if bookmarked then remove
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          //if not then bookmark
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  }

  //define icon color for bookmarked articles
  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { 'color': '#E9BE59' };
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        {props.inBookmarks || <FontAwesomeIcon icon={faEyeSlash} onClick={() => dispatch(hideArticle(props.title))} className={styles.hideIcon} />}
      </div>
      <h4 style={{ textAlign: "right" }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image src={props.urlToImage} alt={props.title} className={styles.image} width={600} height={314} />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
