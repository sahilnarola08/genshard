import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { AcademyCard } from '.'
import { apiBaseUrl } from '../../../../constants'
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor, } from "react-draft-wysiwyg";

function Academy() {
  const params = useParams<{ id: string }>()
  const history = useHistory()

  const [academy, setAcademy] = useState<any>({})
  const [relatedAcademy, setRelatedAcademy] = useState<any>([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (params.id) {
      axios.get(`${apiBaseUrl}/api/v1/academy/${params.id}`).then(res => {
        setAcademy(res.data)
      })
      axios.get(`${apiBaseUrl}/api/v1/academy`, { params: { limit: 4 } }).then(({ data }) => {
        let academies = [] as any
        for (let i = 0; i < data.values.length; i++) {
          const academy = data.values[i]
          if (academy._id !== params.id && academies.length < 3) {
            academies.push(academy)
          }
        }
        setRelatedAcademy(academies)
      })
    }
  }, [params.id])

  const { heading = "", image = "", link = "", content = "", description = "", type = "" } = academy

  return <div className="community-pg">
    <div className="gs-academy-main">
      <div className="community-container">
        <div className="academy-container">
          <div className="academy-header">
            <span onClick={() => history.push('/community/academy')}>{'<'}</span>
            <h1>GS Academy</h1>
          </div>
          <div className='academy-details-container'>
            <div className="image-item">
              <img src={image} alt="" />
            </div>
            <div className="breadcrumbs-item">
              <h3>GS Academy <span>{">"}</span> {type.toLowerCase()} <span>{">"}</span></h3>
            </div>
            <div className="heading-item">
              <h1>{heading}</h1>
            </div>
            <div className="content-item" id="rich-text-editor-id">
              {/* <p>{content || description}</p> */}

              {(content && typeof content === "object") ? <Editor
                readOnly
                toolbarHidden
                editorState={EditorState.createWithContent(convertFromRaw(content))}
                editorClassName="editor-editorClassName"
              /> : <p>{content || description}</p>}
            </div>

            <div className='related-item'>
              <div className="academy-cards-container">
                {
                  relatedAcademy.length ? relatedAcademy.map((item: any) => <AcademyCard cardDetails={item} />)
                    : null
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
}

export default Academy