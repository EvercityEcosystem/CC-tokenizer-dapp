const ECOREGISTRY_API = "https://api-front.ecoregistry.io/api";

const useEcoRegistry = () => {

  const fetchProject = (id) => {
    fetch(`${ECOREGISTRY_API}/project/public/${id}`, {
      headers: {
        platform: "ecoregistry",
        ln: "eng"
      }
    }).then(res => res.json()).then(project => {
      console.log(project)
    })
  }

  return {
    fetchProject
  };
};

export default useEcoRegistry;
