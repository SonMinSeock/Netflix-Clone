import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getPopularTv,
  getPopulationMovies,
  getUpcommingMovies,
  getVideos,
  getVideosTv,
  IGetMoviesResult,
  IGetPopularResult,
  IGetPopularTvResult,
  IGetTopRatedResult,
  IGetUpcomingResult,
  IGetVideoResult,
} from "./api";
import { makeImagePath } from "./utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import YouTube from "react-youtube";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgImg: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 150px 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgImg});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 12px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -90px;
  background-color: yellow;
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

const VideoInfo = styled.div``;

const Iframe = styled.iframe`
  margin-top: 10px;
  width: 50%;
  height: 100%;
`;

const NowPlayingArrowBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 85px;
`;

const PopularArrowBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 390px;
`;

const TopRatedArrowBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 690px;
`;

const UpComingArrowBtn = styled.button`
  position: absolute;
  right: 20px;
  top: 1000px;
`;

const SliderTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  position: absolute;
  top: -50px;
`;

const SliderPopularTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  position: absolute;
  top: 225px;
`;

const SliderTopMovieTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  position: absolute;
  top: 545px;
`;

const SliderUpcomingTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 32px;
  position: absolute;
  top: 825px;
`;

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

function Tv() {
  const [index, setIndex] = useState(0);
  const [popularIndex, setPopluarInex] = useState(0);
  const [topRatedIndex, setTopRatedInex] = useState(0);
  const [upcomingIndex, setUpcomingInex] = useState(0);
  const [leftToggle, setLeftToggle] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/tv/:movieId");

  const { scrollY } = useScroll();

  const { isLoading, data } = useQuery<IGetPopularTvResult>(
    ["Tv", "PopularTv"],
    getPopularTv
  );

  const videosId = data?.results[0].id;

  const { isLoading: loading, data: videos } = useQuery<IGetVideoResult>(
    ["videos", videosId],
    () => getVideosTv(videosId ?? 0),
    {
      enabled: !!videosId,
    }
  );

  const { isLoading: popluarLoading, data: popularData } =
    useQuery<IGetPopularResult>(["popluar", videos?.id], getPopulationMovies, {
      enabled: !!videos?.id,
    });

  const { isLoading: topRatedLoading, data: topRatedData } =
    useQuery<IGetTopRatedResult>("topRated", getPopulationMovies, {
      enabled: !!popularData?.results[0].id,
    });

  const { isLoading: upComingLoading, data: upComingData } =
    useQuery<IGetUpcomingResult>("upComing", getUpcommingMovies, {
      enabled: !!topRatedData?.results[0].id,
    });

  const toggleLeaving = () => setLeaving((prev) => !prev);

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
    } else if (slider === "popular") {
      if (popularData) {
        if (leaving) return;

        toggleLeaving();

        const totalMovies = popularData?.results.length;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        console.log(maxIndex);
        setLeftToggle(false);
        setPopluarInex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (slider === "topRated") {
      if (topRatedData) {
        if (leaving) return;

        toggleLeaving();

        const totalMovies = topRatedData?.results.length;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        setLeftToggle(false);
        setTopRatedInex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    } else if (slider === "upcoming") {
      if (upComingData) {
        if (leaving) return;

        toggleLeaving();

        const totalMovies = upComingData?.results.length;
        const maxIndex = Math.floor(totalMovies / offset) - 1;

        setLeftToggle(false);
        setUpcomingInex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/tv/${movieId}`);
  };

  const onOverlayClick = () => history.push("/tv");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const clickedPopluar =
    bigMovieMatch?.params.movieId &&
    popularData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const clickedTopRated =
    bigMovieMatch?.params.movieId &&
    topRatedData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const clickedUpcoming =
    bigMovieMatch?.params.movieId &&
    upComingData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

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

  const rowVariants2 = {
    hidden: {
      x: window.innerWidth + 5,
      y: 300,
    },
    visible: {
      x: 0,
      y: 300,
    },
    exit: {
      x: -window.innerWidth - 5,
      y: 300,
    },
  };

  const rowTopRatedVariants = {
    hidden: {
      x: window.innerWidth + 5,
      y: 600,
    },
    visible: {
      x: 0,
      y: 600,
    },
    exit: {
      x: -window.innerWidth - 5,
      y: 600,
    },
  };

  const rowUpcomingVariants = {
    hidden: {
      x: window.innerWidth + 5,
      y: 900,
    },
    visible: {
      x: 0,
      y: 900,
    },
    exit: {
      x: -window.innerWidth - 5,
      y: 900,
    },
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner $bgImg={makeImagePath(data?.results[0].backdrop_path || "")}>
            <div style={{ display: "flex" }}>
              <VideoInfo>
                <Title>{data?.results[0].name}</Title>
                <Overview>{data?.results[0].overview}</Overview>
                <YouTube
                  videoId={videos?.results[2].key}
                  opts={{
                    width: "890",
                    height: "520",
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                />
              </VideoInfo>
            </div>
          </Banner>
          <Slider>
            <SliderTitle>Popular</SliderTitle>
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
                        <h4>{movie.name}</h4>
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
                  {clickedMovie ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  ) : clickedPopluar ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedPopluar.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedPopluar.title}</BigTitle>
                      <BigOverview>{clickedPopluar.overview}</BigOverview>
                    </>
                  ) : clickedTopRated ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTopRated.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTopRated.title}</BigTitle>
                      <BigOverview>{clickedTopRated.overview}</BigOverview>
                    </>
                  ) : clickedUpcoming ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedUpcoming.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedUpcoming.title}</BigTitle>
                      <BigOverview>{clickedUpcoming.overview}</BigOverview>
                    </>
                  ) : null}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
