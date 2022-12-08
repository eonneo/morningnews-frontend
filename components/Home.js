import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import fetch from '../next.config';

function Home() {
  //get the value from bookmarks reducer
  const bookmarks = useSelector((state) => state.bookmarks.value);
  //get the value from hiddenArticles reducer
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});

  //display the articles when the component opens
  useEffect(() => {
    fetch(`${fetch}articles`)
      .then(response => response.json())
      .then(data => {
        //set the first as top article
        setTopArticle(data.articles[0]);
        //set the other articles as articles
        setArticlesData(data.articles.filter((data, i) => i > 0));
      });
  }, []);

  //filter hidden articles
  const filteredArticles = articlesData.filter((data) => !hiddenArticles.includes(data.title));

  //display articles showing if bookmarked or not
  const articles = filteredArticles.map((data, i) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  //display top article showing if bookmarked or not
  let topArticles;
  if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />
  } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />
  }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
    </div>
  );
}

export default Home;
