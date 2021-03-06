import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import NavBar from "../components/navbar/Navbar";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Title from "../components/steps/dynamic_title";
import { fetchModels } from "../context/database";
import { Spinner } from "react-bootstrap";
const Select = dynamic(() => import("react-select"), { ssr: false });
import LossLineChart from "../components/charts/lossLineChart";
import AccuracyLineChart from "../components/charts/accuracyLineChart";
import FLineChart from "../components/charts/f1LineChart";
import ValidationAccuracyRadial from "../components/charts/validationAccuracyRadial";
import TrainingAccuracyRadial from "../components/charts/trainingAccuracyRadial";
import HeatMap from "../components/charts/confusionMatrix";
import TSNE from "../components/charts/tsnePlot";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper);
  const [selected, setSelected] = React.useState();
  const [models, setModels] = React.useState({});
  const [model, setModel] = React.useState({});

  React.useEffect(() => {
    fetchModels(setModels);
  }, []);

  const handleChange = (augment) => {
    setSelected(augment);
  };

  React.useEffect(() => {
    var curr = null;
    if (selected && selected.value == 0) {
      // Base Model
      var key = Object.keys(models)[0];
      curr = models[key];
    } else if (selected && selected.value == 1) {
      // Latest
      var key = Object.keys(models)[Object.keys(models).length - 1];
      curr = models[key];
    }
    setModel(curr);
  }, [selected]);

  return (
    <div className={classes.root}>
      <Title />
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" style={{ paddingTop: "2rem" }}>
          <Typography variant="h4">Model Statistics</Typography>
          <hr />
        </Container>

        {Object.keys(models).length ? (
          <>
            <Container maxWidth="lg" style={{ paddingBottom: "2rem" }}>
              <Typography variant="h6" style={{ marginBottom: "1em" }}>
                Select the model for the metrics
              </Typography>
              <Select
                id="modelSelector"
                options={modelOptions}
                value={selected}
                onChange={handleChange}
              />
            </Container>

            <Container maxWidth="lg" className={classes.container}>
              {model ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper className={fixedHeightPaper}>
                      <TrainingAccuracyRadial
                        acc_p={
                          models[Object.keys(models)[0]].model_metrics.acc_p
                        }
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper className={fixedHeightPaper}>
                      <ValidationAccuracyRadial
                        accuracy={
                          models[Object.keys(models)[0]].model_metrics.valid_acc
                        }
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                      <div className="accGraphContainer">
                        <AccuracyLineChart
                          acc_p={model.model_metrics.acc_p}
                          loss_p={model.model_metrics.loss_p}
                        />
                      </div>
                      <div className="pt-3">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                          <Typography className={classes.heading}><span style={{color:"green"}}><b>How to improve my model?</b></span></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                            Accuracy score gives us information directly about the model. If the score is higher than previous model's score
                            than the changes made by user is helping the model and boosting its performance but if score decreases than the 
                            changes made by user is backfiring. In the case where accuracy score decreases the user should
                                <ol>
                                  <li>add proper regularization to the network,</li>
                                  <li>add more images for training.</li>
                                </ol>
                                and retrain the model.
                            </Typography>
                          </AccordionDetails>
                        </Accordion> 
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper className={fixedHeightPaper}>
                      <div className="accGraphContainer">
                        <FLineChart
                          loss_p={model.model_metrics.loss_p}
                          f1_p={model.model_metrics.f1_p}
                        />
                      </div>
                      <div className="pt-3">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                          <Typography className={classes.heading}><span style={{color:"green"}}><b>How to improve my model?</b></span></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              F1 Score is an overall measure of the model's accuracy. A good score implies that the model 
                              trained has lower number of False Positives and False Negetives. If the F1 score decreases then 
                              the recent changes made to the model is effecting the model in negetive way. Hence in such case 
                              to imporve the model we should add more images for training and retrain the model. 
                            </Typography>
                          </AccordionDetails>
                        </Accordion> 
                      </div>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <div className="heatMapContainer">
                        <HeatMap matrix={model.model_metrics.matrix} />
                      </div>
                      <div className="pt-3">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                          <Typography className={classes.heading}><span style={{color:"green"}}><b>How to improve my model?</b></span></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              The Confusion Matrix helps us to understand how well the
                              model is performing the classification task. It provides
                              us with the data of True Positives, True Negatives,
                              False positives, and False Negatives, which gives us a
                              broad view of how well the model works. So if True
                              Positives and True Negatives have comparatively much
                              higher than False Positives and False Negatives, then
                              the model is working fine. Else we need to improve our
                              model by adding images to the dataset and training it
                            </Typography>
                          </AccordionDetails>
                        </Accordion> 
                      </div>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                      <div className="graphContainer">
                        <LossLineChart
                          valid_acc={model.model_metrics.valid_acc}
                          loss_p={model.model_metrics.loss_p}
                        />
                      </div>
                      <div className="pt-3">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                          <Typography className={classes.heading}><span style={{color:"green"}}><b>How to improve my model?</b></span></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              If the validation loss seems to be much higher than
                              training loss, it implies that the model is starting to
                              overfit on the data, and hence the solution to this
                              issue would be
                              <ol>
                                <li>to add proper regularization to the network,</li>
                                <li>to simplify the network,</li>
                                <li>to add more images for training.</li>
                              </ol>
                              and retrain the model.
                            </Typography>
                          </AccordionDetails>
                        </Accordion> 
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper className={classes.paper}>
                      <div className="tsneContainer">
                        <TSNE
                          points={model.model_metrics.Points}
                          labels={model.model_metrics.labels}
                        />
                      </div>
                      <div className="pt-3">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                          <Typography className={classes.heading}><span style={{color:"green"}}><b>How to improve my model?</b></span></Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              The T-SNE plot represents the features in the fully
                              connected layers of the neural network, which our network
                              learns in 2 dimensions. So if data points in the plot for
                              different classes are not localized properly, it implies
                              that the model finds it challenging to learn
                              distinguishing features for those classes. Hence the
                              solution is to add more images of these classes and
                              retrain the model with the extended dataset.
                            </Typography>
                          </AccordionDetails>
                        </Accordion> 
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <div>Select a model to show its metrics</div>
              )}
            </Container>
          </>
        ) : (
          <Container maxWidth="lg" className="text-center">
            <Spinner animation="border" />
          </Container>
        )}
      </main>
    </div>
  );
}

const modelOptions = [
  { value: 0, label: "Base Model" },
  { value: 1, label: "Latest Model" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));
