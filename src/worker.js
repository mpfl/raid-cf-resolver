/**
 * Proof of concept for RAiD resolver piggybacking on DOI resolver using a Cloudflare worker
 */

const DOI_HOST = "doi.org"
const RAID_HOST = "raid.org"

async function handleRequest(request, env) {
  const raidRegex = new RegExp(/^\/102?\.\d+(\..*)?\/.+$/g)
  const raidString = "/10"
  const url = new URL(request.url)
  const pathname = url.pathname
  const search = url.search
  const pathWithParams = pathname + search
  if (pathname.match(raidRegex)) {
      return retrieveDOI(pathWithParams, env)
  } else {
      return retrieveRAID(pathWithParams, env)
  }
}

async function retrieveDOI(pathname, env) {
  const response = await fetch(`https://${DOI_HOST}${pathname}`)
  if (response.redirected && !response.url.startsWith("https://doi.org")) {
    return Response.redirect(response.url, 301)
  } else if ( response.status == 404) {
    return env.ASSETS.fetch('https://assets.local/404.html', 404)
  }
  return Response.redirect(`https://${RAID_HOST}`, 301)
}

async function retrieveRAID(pathname, env) {
  return Response.redirect(`https://${RAID_HOST}${pathname}`, 301)
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};