import { bugService } from "./bug.service.js";
import { loggerService } from "../../service/logger.service.js";
import { authService } from "../auth/auth.service.js";

export async function CheckCookie(req, res, next) {
    const { bugId } = req.params;
  try {

    let visitedBugs  = req.cookies.visitedBugs || []
    visitedBugs.push(bugId)

    res.cookie('visitedBugs',visitedBugs,{maxAge:1000*10})
    if (visitedBugs.length >= 3) {

      loggerService.warn("limited exceeded");
      res.status(401).send('Wait for a bit');
    }
    next()
  } catch (err) {
    loggerService.error(err);
    res.status(400).send("coundt reach data");
  }
}

export async function getBug(req, res) {
  try {
    const { txt, severity, labels, pageIdx, sortBy, sortDir,owner } = req.query;

    const filterBy = {
      txt,
      severity: +severity,
      labels,
      owner
    };

    if (pageIdx) filterBy.pageIdx = +pageIdx;
    if (sortBy) {
      filterBy.sortBy = sortBy;
      filterBy.sortDir = sortDir;
    }

    let bugs = await bugService.query(filterBy);

    res.send(bugs);
  } catch (err) {
    loggerService.error(err);
    res.status(400).send("coundt reach data");
  }
}

export async function getBugById(req, res) {
  const { bugId } = req.params;
  try {
    const bug = await bugService.queryById(bugId);

    res.send(bug);
  } catch (err) {
    loggerService.error(err);
    res.status(400).send("coundt reach data");
  }
}

export async function RemoveBug(req, res) {
  const { bugId } = req.params;
  const {loggedinUser} = req
  try {


    await bugService.remove(bugId,loggedinUser);

    res.send("bug deleted");
  } catch (err) {
    loggerService.error(err);
    res.status(400).send("coundt reach data");
  }
}

export async function addBug(req, res) {
  const {loggedinUser} = req
  try {

    const { _id, title, description, severity, createdAt, labels } = req.body;
    const bugToSave = { _id, title, description, severity, createdAt, labels };
    const savedBug = await bugService.save(bugToSave,loggedinUser);

    res.send(savedBug);

  } catch (err) {
    loggerService.error(err);
    res.status(400).send("Couldn't save the data");
  }
}

export async function updateBug(req, res) {
  try {
    const {loggedinUser} = req
    const { _id, title, description, severity, createdAt, labels } = req.body;
    const bugToSave = { _id, title, description, severity, createdAt, labels };
    const savedBug = await bugService.save(bugToSave,loggedinUser);
    res.send(savedBug);
  } catch (err) {
    loggerService.error(err);
    res.status(400).send("Couldn't save the data");
  }
}
