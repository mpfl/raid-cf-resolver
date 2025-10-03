/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const DOI_HOST = "doi.org"
const RAID_HOST = "raid.org"

async function handleRequest(request, ctx) {
  const raidRegex = new RegExp(`\/102?\.\d+(\..*)?\/.+`)
  const raidString = "/10"
  const url = new URL(request.url)
  const pathname = url.pathname
  const search = url.search
  const pathWithParams = pathname + search
  // console.log("Path name:", pathname)
  // console.log("Regex:", raidRegex)
  // console.log("Regex matches:", pathname.match(raidRegex))
  // console.log("Starts with:", pathname.startsWith(raidString))
  // if (pathname.match(raidRegex)) {
  if (pathname.match(raidString)) {
      return retrieveDOI(pathWithParams)
  } else {
      return retrieveRAID(pathWithParams)
  }
}

async function retrieveDOI(pathname) {
  const response = await fetch(`https://${DOI_HOST}${pathname}`)
  // console.log(response.url)
  // console.log(response.redirected)
  // console.log(response.status)
  if (response.redirected && !response.url.startsWith("https://doi.org")) {
    return Response.redirect(response.url, 301)
  } else if ( response.status == 404) {
    return new Response("RAiD not found", {status: 404})
  }
  return response
}

async function retrieveRAID(pathname) {
  return Response.redirect(`https://${RAID_HOST}${pathname}`, 301)
}

export default {
  async fetch(request) {
    return handleRequest(request);
  }
};