import contextlib, importlib.util, io, json, os, pathlib, tempfile, unittest, urllib.error
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('inspect_vercel',pathlib.Path(__file__).with_name('inspect_vercel.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)

class ProvenanceSafetyTests(unittest.TestCase):
 def test_no_credential_means_no_request(self):
  with patch.dict(os.environ,{},clear=True), patch.object(m,'get_json') as req, patch('sys.argv',['inspect','--out','unused.json']), contextlib.redirect_stderr(io.StringIO()):
   self.assertEqual(m.main(),2);req.assert_not_called()
 def test_inventory_uses_verified_team_and_excludes_sensitive_fields(self):
  calls=[]
  def api(path,params,token):
   calls.append((path,params))
   if '/projects/' in path and not path.endswith('/domains'):return {'id':'prj_test','accountId':'team_verified','name':'mobile-world-website','env':[{'value':'SECRET_SHOULD_NOT_APPEAR'}],'targets':{'production':{'id':'dpl_current','meta':{'githubCommitSha':'abc','secret':'SECRET_SHOULD_NOT_APPEAR'}}}}
   if path.endswith('/domains'):return {'domains':[{'name':'www.mobileworldfaridabad.com','verified':True,'verification':[{'value':'SECRET_SHOULD_NOT_APPEAR'}]}]}
   if path=='/v6/deployments':return {'deployments':[{'uid':'dpl_current','meta':{'githubCommitSha':'abc','token':'SECRET_SHOULD_NOT_APPEAR'}}]}
   return {'id':'dpl_history','env':{'KEY':'SECRET_SHOULD_NOT_APPEAR'}}
  with tempfile.TemporaryDirectory() as d:
   target=pathlib.Path(d)/'report.json'
   with patch.dict(os.environ,{'VERCEL_TOKEN':'test-placeholder'}),patch.object(m,'get_json',side_effect=api),patch('sys.argv',['inspect','--out',str(target)]),contextlib.redirect_stdout(io.StringIO()): self.assertEqual(m.main(),0)
   text=target.read_text();self.assertNotIn('SECRET_SHOULD_NOT_APPEAR',text);self.assertNotIn('test-placeholder',text)
   self.assertEqual(json.loads(text)['productionTarget']['id'],'dpl_current')
   self.assertTrue(all(params.get('teamId')=='team_verified' for _,params in calls[1:]))
   self.assertTrue(all('/env' not in path for path,_ in calls))
 def test_api_error_does_not_disclose_response_body(self):
  error=urllib.error.HTTPError('https://api.vercel.com',401,'Unauthorized',{},io.BytesIO(b'SENSITIVE_BODY'))
  with patch.object(m.urllib.request,'urlopen',side_effect=error):
   with self.assertRaises(RuntimeError) as caught:m.get_json('/v9/projects/test',{},'placeholder')
  self.assertIn('401',str(caught.exception));self.assertNotIn('SENSITIVE',str(caught.exception))

if __name__=='__main__':unittest.main()
