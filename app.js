import React, { useEffect, useState } from 'react'
import { AppBar, Box, makeStyles, Typography, createMuiTheme, ThemeProvider, Tabs, Tab, Paper, Button, Grid, Fade } from '@material-ui/core'
import * as mySVGJSON from './svg.json'
import * as projectsList from './projects.json'

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
    gridCol : {
        maxWidth:'45vw'
    },
    projectTxt:{
        textTransform:'none',
        textJustify: 'auto'
    },
    projectImg:{
        height:'5em',
    }
}))


const App = () => {
    return (
        <ThemeProvider theme={theme}>
            
            <TabBar></TabBar>
            <Box height="80%" display="flex" alignContent="center" alignItems="center" justifyContent="center">
            <ProjectSpace/>
            </Box>
        </ThemeProvider>
    )
}

const ProjectSpace = () =>{
    
    const [clicked, setClicked] = useState(false)

    const handleClick = () => {
        setClicked(true)
    }

    return (
        <Box display="flex" pt={2}>
            
        {clicked ?
            
             
           <SpawnProjects />
           : <Box flex pt={10}><Button onClick={handleClick}>Enter</Button></Box>
            
        }
        </Box>
    )
}

const SpawnProjects = () => {
    const classes = useStyles()

    const [show, isShow] = useState(false)

    const showButtonClick = (project) =>{
        console.log(project)
    }

    useEffect(()=>{
        isShow(true)
    })


    return (
        
        <Fade in={show}>
        <Box display="flex" >
            {[0, 1].map(x => (
                <Grid  key={x} justify="space-between" container direction="row" justify="center" spacing={2}>
                    {projectsList.projects.slice(x * 3, (x + 1) * 3).map(p => (
                        p.name &&
                        <Grid className={classes.gridCol} key={p.name} item xs={12}>
                            <ProjectBox showButtonClick={()=>showButtonClick(p)} project={p} />
                        </Grid>
                    ))
                    }

                </Grid>
            ))}

        </Box>
        </Fade>


    )
}

const ProjectBox = ({ project, showButtonClick }) => {
    const classes = useStyles()

    return (
    <Box textAlign="center">
        <Button onClick={showButtonClick} variant="outlined">
            <Box>
                <img className={classes.projectImg} src={project.logo}></img>
            <Typography className={classes.projectTxt} variant="h6">{project.name}</Typography>
            <Typography className={classes.projectTxt} variant="body2">{project.description}</Typography>
            </Box>  
        </Button>

    </Box>
    )
}

const TabBar = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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