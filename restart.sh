deploys=`kubectl get deployments -n microblog | tail -n6 | cut -d ' ' -f 1`
for deploy in $deploys; do
  kubectl rollout restart deployments/$deploy -n microblog
done