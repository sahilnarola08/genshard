import React, { useEffect, useState } from "react";
import FilterForProjects from "../FilterForProjects/FilterForProjects";
import NFTProjectCard from "../NFTProjectCard/NFTProjectCard";
import axios from 'axios'
import { useActiveWeb3React } from './../../../../hooks/web3'
import "./style.sass";
import { useSelector } from "react-redux";
import { AppState } from "../../../../state";
import LoaderComp from "../../../../shared/components/LoaderComponent";
import { useAddPopup } from "../../../../state/application/hooks";


const NFTCollection = () => {

  const [msg, setMsg] = useState("Please Wait")
  const [isLoading, setIsLoading] = useState(false)
  const [projectsArr, setProjectsArr] = useState<any>([])
  const [selectedProject, setSelectedProject] = useState<any>([])
  const [NFTCollections, setNFTCollections] = useState<any>([])
  const [projectData, setProjectData] = useState<any>([])
  const addErrorPopup = useAddPopup();
  const { library, account } = useActiveWeb3React()

  const network = useSelector((state: AppState) => state.application.network)

  const getNFTCollectionData = async () => {
    setMsg("Loading NFTs")
    setIsLoading(true);
    try {
      const headers = {
        Authorization: process.env.REACT_APP_BASE_TOKEN,
      };
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const url = `${baseUrl}/api/v1/projects/wallet/${account}/nft`
      const resp = await axios.get(url, { headers: headers }
      );
      console.log(resp);
      setNFTCollections(resp?.data?.values)
    } catch (error: any) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: error.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
    setMsg("Please wait")
    setIsLoading(false);
    // return resp;
  };
  useEffect(() => {
    getNFTCollectionData()
  }, [network])
  useEffect(() => {
    if (selectedProject.length > 0) {
      console.log('selectedProject');
      const allNFTs = NFTCollections && NFTCollections.filter((value, ind) => (selectedProject.length > 0 && selectedProject.includes(value.name) && value));
      setProjectsArr(allNFTs);
    } else {
      console.log('selectedProject else');
      const allNFTs = NFTCollections && NFTCollections.filter((value, ind) => (value.nfts.length > 0 && value?.isAirDropped));
      console.log('selectedProject allNFTs', allNFTs);
      setProjectData(allNFTs)
      setProjectsArr(allNFTs);
    }
  }, [isLoading, selectedProject])


  const handleFilter = (item) => {
    if (item.checked) {
      setSelectedProject([item.name, ...selectedProject])
    } else {
      setSelectedProject(selectedProject.filter((project) => project !== item.name))
    }
  }

  return (
    <div className="nftCollection">
      {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
      {
        projectData && projectData.length ?
          <>
            <FilterForProjects projects={projectData} handleFilter={handleFilter} />
            <div className="allProjects">
              <div className="projectsBlocks">
                {projectsArr.map((project, ind) => (
                  project.nfts?.map((projectValue, ind) => {
                    const details = { genNFTAddress: project.genNFTAddress, tokenId: project.tokenId, ...projectValue }
                    return <NFTProjectCard nftData={details} key={ind} />
                  })
                ))}
              </div>
            </div>
          </>
          :
          <div className="no-Nfts-found">
            No NFTs Found.
          </div>
      }
    </div>
  );
};

export default NFTCollection;
