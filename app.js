import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, Box, makeStyles, Typography, createMuiTheme, ThemeProvider, Tabs, Tab, Paper, Button, Grid, Fade, Link, DialogContent, IconButton, List, ListItem } from '@material-ui/core'
import * as projectsList from './projects.json'
import CloseIcon from '@material-ui/icons/Close';
import LinkIcon from '@material-ui/icons/Link';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import PersonIcon from '@material-ui/icons/Person';


import OBN from './img/OBN.png'
import MVRWebsite from './img/MVRWebsite.png'
import OngoLogo from './img/Ongo.png'
import shotHorde1 from './img/shot-Horde.png'
import shotHorde2 from './img/shot-Horde2.png'
import shotMVRPower from './img/shot-MVRPower.png'
import shotMVRWeb from './img/shot-MVRWeb.png'
import shotPortfolio from './img/shot-Portfolio.png'
import shotAddin from './img/shot-Addin.png'
import MVRLogo from './img/MVRLogo.png'

const logos = { MVRLogo, OBN, MVRWebsite, shotHorde1, shotHorde2, shotMVRPower, shotMVRWeb, shotPortfolio, shotAddin, OngoLogo }

// projectsList.projects.splice(4,0,[])

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'EB Garamond',
        ].join(',')
    },
    palette: {
        type: 'dark',
        primary: {
            main: 'rgb(255,255,255)'
        },
        secondary: {
            main: 'rgb(0,0,0)'
        }
    }
});

const useStyles = makeStyles(() => ({
    header: {
        '& div': {
            opacity: '80%',
            position: 'absolute'
        }
    },
    gridCol: {
        maxWidth: '40vw',
        alignSelf: 'center'
    },
    projectTxt: {
        textTransform: 'none',
        textJustify: 'auto'
    },
    projectImg: {
        height: '4rem',
    },
    titleBox: {
        backgroundColor: 'grey'
    },
    closeButton: {
        float: 'right'
    },
    shotImg: {
        height: '8rem'
    }
}))


const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <TabBar></TabBar>
            <Box height="100%" display="flex" alignContent="center" alignItems="center" justifyContent="center">
                <ProjectSpace />
            </Box>
        </ThemeProvider>
    )
}

const ProjectSpace = () => {

    const [clicked, setClicked] = useState(false)

    const handleClick = () => {
        setClicked(true)
    }

    return (
        <Box pt={2}>

            {clicked ?
                <SpawnProjects />
                : <Welcome handleClick={handleClick} />
            }
        </Box>
    )
}

const Welcome = ({ handleClick }) => {
    return (
        <Box display="flex" pt={5}>
            <Button onClick={handleClick}>Enter</Button>
        </Box>
    )
}

const SpawnProjects = () => {
    const classes = useStyles()

    const [show, isShow] = useState(false)
    const [modal, setModal] = useState()

    const handleCloseModal = () => {
        setModal()
    }

    const showButtonClick = (project) => {
        setModal(project)
    }

    useEffect(() => {
        isShow(true)
    })


    return (

        <Fade in={show}>
            <Box height="80%" display="flex" >
                {[0, 1].map(x => (
                    <Grid key={x} container direction="row" justify="center" spacing={2}>
                        {projectsList.projects.slice(x * 3, (x + 1) * 3).map(p => (
                            p.name &&
                            <Grid className={classes.gridCol} key={p.name} item xs={12}>
                                <ProjectBox showButtonClick={() => showButtonClick(p)} project={p} />

                            </Grid>
                        ))
                        }

                    </Grid>
                ))}

                {modal && <ProjectModal project={modal} handleClose={handleCloseModal} />}

            </Box>
        </Fade>


    )
}

const ProjectBox = ({ project, showButtonClick }) => {
    const classes = useStyles()
    let thisImg = ''

    try {
        if (project.logo.indexOf('http') > -1) {
            thisImg = project.logo
        } else {
            thisImg = logos[project.logo]
        }
    } catch (e) {
        thisImg = project.logo
    }

    return (
        <Box textAlign="center" className={classes.projectBox}>
            <Button onClick={showButtonClick} variant="outlined">
                <Box>
                    <img className={classes.projectImg} src={thisImg}></img>
                    <Typography className={classes.projectTxt} variant="h6">{project.name}</Typography>
                    <Typography className={classes.projectTxt} variant="caption">{project.keywords}</Typography>
                </Box>
            </Button>

        </Box>
    )
}

const ProjectModal = ({ project, handleClose }) => {

    const classes = useStyles()

    let shotImg = ''

    try {
        if (project.shot.indexOf('http') > -1) {
            shotImg = project.shot
        } else {
            shotImg = logos[project.shot]
        }
    } catch (e) {
        shotImg = project.shot
    }

    return (
        <Dialog open={!!project} onClose={handleClose}>
            <DialogTitle className={classes.titleBox} id="simple-dialog-title">
                {project.name}
                <IconButton className={classes.closeButton} size="small" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>

                <Box display="flex" justifyContent="center">
                    <img className={classes.shotImg} src={shotImg}></img>
                </Box>
                <List>
                    <ListItem>
                        <Typography>{project.description}</Typography>
                    </ListItem>
                    <ListItem>
                        <Typography>Keywords: {project.keywords}</Typography>
                    </ListItem>
                    <ListItem>
                        <LinkIcon />
                        <Box pl={2}>
                            <Link href={project.url}>{project.url}</Link>
                        </Box>
                    </ListItem>
                    <ListItem>
                        <GitHub />
                        <Box pl={2}>
                            <Link href={project.gitUrl}>{project.gitUrl}</Link>
                        </Box>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    )
}

const TabBar = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setValue(0)
    }

    return (
        <Box >
            <Paper >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Projects" />
                    <Tab label="Contact" />
                </Tabs>
            </Paper>
            <Dialog open={!!(value == 1)} onClose={handleClose}>
                <DialogTitle>Contact</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <PersonIcon />
                            <Box pl={1}>
                                <Typography>
                                    Oliver Belfitt-Nash
                            </Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <EmailIcon />
                            <Box pl={1}>
                                <Typography>
                                    olibn333@gmail.com
                            </Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <GitHubIcon />
                            <Box pl={1}>
                                <Link href="https://github.com/olibn333">https://github.com/olibn333</Link>
                            </Box>
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    )
}


export default App