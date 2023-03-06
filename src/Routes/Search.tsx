import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearchMovies, IGetSearchMovieResult } from "./api";
import { makeImagePath } from "./utils";

const Slider = styled.div`
  position: relative;
  top: 200px;
  background-color: yellow;
`;

const SliderTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  position: absolute;
  top: -50px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ $bgImg: string }>`
  height: 200px;
  background-image: url(${(props) => props.$bgImg});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const NowPlayingArrowBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 85px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

const boxVariants = {
  nomal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword");

  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/search/:movieId");

  const { scrollY } = useScroll();

  const { isLoading, data } = useQuery<IGetSearchMovieResult>(
    ["movies", "nowPlaying"],
    () => getSearchMovies(keyword ?? "")
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [leftToggle, setLeftToggle] = useState(false);

  const history = useHistory();

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };

  const increaseIndex = (slider: string) => {
    if (slider === "now_playing") {
      if (data) {
        if (leaving) return;

        toggleLeaving();

        const totalMovies = data.results.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        console.log(maxIndex);
        setLeftToggle(false);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  const onOverlayClick = () => history.push("/search");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  console.log(data?.results);

  return (
    <>
      <Slider>
        <SliderTitle>Search Movie</SliderTitle>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit={leftToggle ? "leftExit" : "exit"}
            transition={{ type: "tween", duration: 2 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(index * offset, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  key={movie.id}
                  variants={boxVariants}
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  $bgImg={makeImagePath(movie.backdrop_path || "")}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <NowPlayingArrowBtn onClick={() => increaseIndex("now_playing")}>
          ▶
        </NowPlayingArrowBtn>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              layoutId={bigMovieMatch.params.movieId}
              style={{
                top: scrollY.get() + 100,
              }}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Search;
