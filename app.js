import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, AppBar, Box, makeStyles, Typography, createMuiTheme, ThemeProvider, Tabs, Tab, Paper, Button, Grid, Fade, Link, DialogContent, IconButton, List, ListItem } from '@material-ui/core'
import * as mySVGJSON from './svg.json'
import * as projectsList from './projects.json'
import { Email, GitHub } from '@material-ui/icons'
import CloseIcon from '@material-ui/icons/Close';
import LinkIcon from '@material-ui/icons/Link';


import OBN from './img/OBN.png'
import MVRWebsite from './img/MVRWebsite.png'
import OngoLogo from './img/Ongo.png'
import shotHorde1 from './img/shot-Horde.png'
import shotHorde2 from './img/shot-Horde2.png'
import shotMVRPower from './img/shot-MVRPower.png'
import shotMVRWeb from './img/shot-MVRWeb.png'
import shotPortfolio from './img/shot-Portfolio.png'
import shotAddin from './img/shot-Addin.png'

const logos = { OBN, MVRWebsite, shotHorde1, shotHorde2, shotMVRPower, shotMVRWeb, shotPortfolio, shotAddin, OngoLogo }

// projectsList.projects.splice(4,0,[])

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Garamond',
        ].join(','),
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

const useStyles = makeStyles(theme => ({
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
        height: '5em',
    },
    titleBox: {
        backgroundColor: 'grey'
    },
    closeButton: {
        float: 'right'
    },
    shotImg: {
        height: '10em'
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
                    <Grid key={x} justify="space-between" container direction="row" justify="center" spacing={2}>
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
    const classes = useStyles();
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
                            <Email />
                            <Typography>
                                Oliver Belfitt-Nash
                            </Typography>
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

const NameSVG = () => {
    const classes = useStyles()

    const [myPath, setPath] = useState(mySVGJSON.path)
    const [clicked, setClicked] = useState(false)

    const svgClick = () => {
        if (!clicked) {

            const numRegex = /[0-9]/gm
            const MRegex = /(M[^A-Z]*)/gm
            const LRegex = /(L[^A-Z]*)/gm
            const QRegex = /(Q[^A-Z]*)/gm
            const ZRegex = /(.[^Z]+)/gm
            const points = myPath.split(' ')
            const newPoints = points.filter((x, i) => i % 2 == 0)
            // const newPath = newPoints.join(' ')
            const newPath = myPath
                .replace(MRegex, (s) => {
                    const nums = s.substr(2).split(' ')
                    const newNums = nums.map(n => n + (Math.random() * 100 - 50))
                    const newStr = newNums.join(' ')
                    return `M 10 10`
                })
                .replace(LRegex, (s) => {
                    const nums = s.substr(2).split(' ')
                    const newNums = nums.map(n => n + (Math.random() * 10 - 5))
                    const newStr = newNums.join(' ')
                    return `L 10 10`
                })
                .replace(QRegex, (s) => {
                    const nums = s.substr(2).split(' ')
                    const newNums = nums.map(n => n + (Math.random() * 10 - 5))
                    const newStr = newNums.join(' ')
                    return ``
                })
            // const newPath = myPath.split(ZRegex).slice(1).join('')
            setPath('newPath')
        } else {
            setPath(mySVGJSON.path)
        }
        setClicked(clicked)
    }

    return (
        <Box className={classes.mySVG} onClick={svgClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path className={classes.mySVGPath} d={myPath} />
            </svg>
        </Box>
    )
}

export default App