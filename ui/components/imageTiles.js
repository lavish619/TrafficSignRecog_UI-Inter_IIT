import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CropImage from "./augmentations/cropImage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: "white",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function SingleLineGridList(props) {
  const classes = useStyles();
  const [showModal, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const [ind, setIndex] = React.useState();

  const handleClick = (index) => {
    setIndex(index);
    setShow(true);
  };

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {props.tileData.map((tile, index) => (
          <GridListTile key={index}>
            <img src={tile[0]} alt={tile[1]} />
            <GridListTileBar
              title={tile[1]}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <IconButton
                  onClick={() => handleClick(index)}
                  aria-label={`star ${tile.title}`}
                >
                  <EditIcon className={classes.title} />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
      <CropImage show={showModal} handleClose={handleClose} imgsrc={ind} />
    </div>
  );
}
