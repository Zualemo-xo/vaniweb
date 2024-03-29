import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";
// import coverImage from "../../assets/welcome-card-cover.webp";
import Image1 from "../../assets/image1.jpg";
import Image2 from "../../assets/image2.jpg";
import MediaCard from "../../components/MediaCard";
import { TextField } from "@material-ui/core";
import { useLocation, Route, Switch, useHistory } from "react-router-dom";
import {
    TransitionGroup,
    CSSTransition
} from "react-transition-group";
import routes from "../routes.enum";
import ReadingCard from "../../components/ReadingCard";
// import  ImagesProvider  from "../../assets/bg.svg";
 //import  intro from "../../assets/bg.svg";


 import { ImagesProvider } from "./contexts/ImagesContext";
 import Intro from "./features/Intro/Intro";


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    centered: {
        [theme.breakpoints.down('xs')]: {
            height: "100%",
            width: "100%",
        },
        [theme.breakpoints.up('xs')]: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
        }
    }
}))

export const WelcomeCards: React.FunctionComponent = props => {
    const classes = useStyles();
    return (
        <div className={classes.centered}>
            {props.children}
        </div>
    )
};

export default function Welcome() {




    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const [age, setAge] = React.useState<string | undefined>();
    const [pincode, setPincode] = React.useState<string | undefined>();

    const dummyFunction = (point: string) => () => history.push(routes.WELCOME + point);
    return (

        <Container fixed disableGutters className={classes.root}>



        <div className="fish" id="fish"></div>
<div className="fish" id="fish2"></div>



            <div className="intro" id="intro"></div>

            <TransitionGroup>
                <CSSTransition
                    key={location.key}
                    classNames="fade"
                    timeout={300}
                >



                    <Switch location={location}>

                    <Route
          path="/"
          exact
          render={props => (
            <ImagesProvider
            intro={true}
              r={require.context(
                "./features/Intro/images/",
                false,
                /\.(png|jpe?g|svg)$/
              )}
            >
              <Intro {...props} />
            </ImagesProvider>
          )} />




                        {/* <Route exact path={routes.WELCOME + "/"}> */}

                            <Route exact path={routes.WELCOME + "/"}          render={props => (
            <ImagesProvider
            intro={true}
              r={require.context(
                "./features/Intro/images/",
                false,
                /\.(png|jpe?g|svg)$/
              )}
            >
              <Intro {...props} />
            </ImagesProvider>
          )}>
                            <WelcomeCards>
                                <MediaCard
                                    imgSrc={Image1}
                                    cardTitle="Welcome to Vani"
                                    cardContext="Hey there, lets find out you reading age. First enter your Biological Age"
                                    buttonText="Next"
                                    formInput={
                                        <TextField
                                            label="Biological Age"
                                            type="text"
                                            value={age ?? ""}
                                            autoFocus
                                            inputProps={
                                                {
                                                    pattern: "^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$",
                                                    title: "Enter a valid Age"
                                                }
                                            }
                                            required onChange={(e) => {
                                                setAge(e.target.value);
                                            }}
                                        />
                                    }
                                    onNext={dummyFunction("/2")}
                                />
                            </WelcomeCards>
                        </Route>
                        <Route path={routes.WELCOME + "/2"}>
                            <WelcomeCards>
                                <MediaCard
                                    imgSrc={Image2}
                                    cardTitle="Let us know where you are from"
                                    cardContext="Only if you provide us your region, we can make sure you get the apt sentence to read."
                                    buttonText="Start"
                                    formInput={
                                        <TextField
                                            label="Pincode"
                                            type="text"
                                            autoFocus
                                            inputProps={
                                                {
                                                    pattern: "^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$",
                                                    title: "Enter a valid Indian Pincode"
                                                }
                                            }
                                            value={pincode ?? ""}
                                            required
                                            onChange={(e) => {
                                                setPincode(e.target.value.replace(" ", ""));
                                            }}
                                        />
                                    }
                                    onNext={() => {
                                        const path = routes.SUBMISSION.replace(":age", age?.toString() ?? "");
                                        history.push(path.replace(":pincode", pincode?.toString() ?? ""));
                                    }}
                                />
                            </WelcomeCards>
                        </Route>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </Container>

    )
}