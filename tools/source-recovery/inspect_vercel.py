#!/usr/bin/env python3
"""Read-only deployment provenance inventory; never deploys or reads env/secret values."""
import argparse, json, os, pathlib, sys, urllib.error, urllib.parse, urllib.request

def get_json(path, params, token):
    url = 'https://api.vercel.com' + path + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/json'}, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f'Vercel API returned HTTP {exc.code}; no response body printed.') from None
    except urllib.error.URLError as exc:
        raise RuntimeError(f'Vercel transport unavailable: {exc.reason}') from None

def deployment_summary(d):
    # Deliberate allowlist: do not serialize env, builds, arbitrary metadata or secrets.
    out = {k: d[k] for k in ['id', 'uid', 'name', 'url', 'readyState', 'state', 'target', 'created', 'createdAt', 'source'] if k in d}
    gs = d.get('gitSource') or {}
    out['gitSource'] = {k: gs[k] for k in ['type', 'repoId', 'ref', 'sha'] if k in gs}
    meta = d.get('meta') or {}
    out['gitMetadata'] = {k: meta[k] for k in ['githubCommitSha', 'githubCommitRef', 'githubRepo', 'githubOrg', 'githubDeployment'] if k in meta}
    return out

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project', default='prj_dplwsmDwQWMjfoePft2dDLIA3QDI')
    p.add_argument('--team-slug', default='faridabadmobileworld-2892')
    p.add_argument('--historical-deployment', default='dpl_aaGzHrJnxrvidMDZAhrJpGsAJhMd')
    p.add_argument('--out', type=pathlib.Path, required=True)
    a = p.parse_args()
    token = os.environ.get('VERCEL_TOKEN')
    if not token:
        print('VERCEL_TOKEN binding is absent. Add it securely in environment settings; do not paste it in chat.', file=sys.stderr)
        return 2
    project = get_json('/v9/projects/' + urllib.parse.quote(a.project, safe=''), {'slug': a.team_slug}, token)
    # Use the verified project account ID returned by the API, never assume a slug is a team ID.
    account_id = project.get('accountId')
    scope = {'teamId': account_id} if isinstance(account_id, str) and account_id.startswith('team_') else {'slug': a.team_slug}
    report = {'project': {k: project[k] for k in ['id', 'name', 'accountId', 'framework'] if k in project}, 'productionTarget': deployment_summary((project.get('targets') or {}).get('production') or {}), 'limitations': ['Metadata inventory is not a recovered source tree or proof of complete original source. No env values, customer records, deployments or configuration writes are requested.']}
    report['domains'] = [{k: x[k] for k in ['name', 'verified', 'redirect', 'redirectStatusCode', 'gitBranch'] if k in x} for x in get_json('/v9/projects/' + urllib.parse.quote(a.project, safe='') + '/domains', scope, token).get('domains', [])]
    ds = get_json('/v6/deployments', dict(scope, projectId=a.project, limit=20), token)
    report['recentDeployments'] = [deployment_summary(d) for d in ds.get('deployments', [])]
    if a.historical_deployment:
        try:
            report['historicalDeployment'] = deployment_summary(get_json('/v13/deployments/' + urllib.parse.quote(a.historical_deployment, safe=''), scope, token))
        except RuntimeError as exc:
            report['historicalDeploymentError'] = str(exc)
    a.out.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation protects prior inventory evidence.
    with a.out.open('x') as f:
        json.dump(report, f, indent=2); f.write('\n')
    print(f'Provenance metadata saved to {a.out}; original source recovery still requires separate verification.')
    return 0

if __name__ == '__main__':
    try:
        sys.exit(main())
    except (RuntimeError, FileExistsError) as exc:
        print(str(exc), file=sys.stderr); sys.exit(1)
