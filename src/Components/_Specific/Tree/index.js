import React, { useState, useEffect, Fragment, useContext, useRef } from 'react';
import { Link } from 'react-router-dom'
import Context from '../../../Utility/Reduxx'
// import { Tree } from 'antd';
import { FiSettings } from "react-icons/fi";
import {
  FaCaretRight,
  FaCaretDown,
  FaCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
} from 'react-icons/fa';
import {
  MdSignalCellular1Bar,
  MdSignalCellular2Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from "react-icons/md";
import styles from './tree.module.scss'
import useURLloader from '../../../hook/useURLloader'

//Tree組件樣式 - icon
const healthIcon = (health) => {
    switch(health){
        case 'up':
            return <FaCircle className={styles.up}/> 
        case 'warning':
            return <FaExclamationTriangle className={styles.warning}/>
        case 'critical':
            return <FaExclamationCircle className={styles.critical}/>
        default:
            return <FaCircle className={styles.up}/>
    }
}

const StrengthIcon = (strength) => {
    switch (strength)
    {
      case 'excellent':
        return <MdSignalCellular4Bar className={styles.excellent}/>
      case 'good':
        return <MdSignalCellular3Bar className={styles.good}/>
      case 'fair':
        return <MdSignalCellular2Bar className={styles.fair}/>
      case 'poor':
      default:
        return <MdSignalCellular1Bar className={styles.poor}/>
    }
}

//Tree組件樣式
const Tree = ({ children }) => {
    return <div className={styles.StyledTree}>{children}</div>
  };



const File = ({ name,strength,path,selected,health,id }) => {
    const { state, dispatch } = useContext(Context)
    // const [currentid, SetCurrentId] = useState (null)

    const GetID = () => {
        dispatch({type:'id', payload:{id: id}})
        console.log(state)
    }

return (
    <div className={styles.StyledFile}>
    {selected === 'health' && healthIcon(health)}
    {selected === 'byOne' && healthIcon(health)}
    {selected === 'model' && healthIcon(health)}
    {selected ==='sim' && StrengthIcon(strength)}

    <Link to="#"><FiSettings className={styles.setting}/></Link>
    <Link to="#"><span onClick={()=>{GetID(id)}}>{name}</span></Link>
    </div>
)
}
  

const Folder = ({ name, children }) => {
const [isOpen, setIsOpen] = useState(false);
const handleToggle = e => {
    e.preventDefault();
    setIsOpen(!isOpen);
};
return (
    <div className={styles.StyledFolder}>
        <div className={styles.folderlabel} onClick={handleToggle}>
        {isOpen? <FaCaretDown/> : <FaCaretRight /> }
            <Link to="#" className={styles.Flink}><span>{name}</span></Link>
        </div>
        <div  className={ isOpen? `${styles.Collapsible}` : `${styles.Collapsible} ${styles.hide}` }>
            {children}
        </div>
    </div>
);
};  


//獲取TreeData 並return結果
const TreePlot = () => {
        // const url = '/api/nodes.json'
        const categroies = [{'type': 'Model', 'value':'model'},{'type': 'Health', 'value':'health'},{'type': 'Strength', 'value':'sim'},{'type': 'ISMI One', 'value':'byOne'}]
        const [selected, setSelected] = useState('model')
        const [Treedata, setTreedata] = useState([{children:[]}])
        const isFirstRun = useRef(true);
        const CGI = {
            device_status: {
              nodeInf: {}
            }
          }
        const url = `/cmd?get=${JSON.stringify(CGI)}`
        const [loading, res] = useURLloader(url)

    useEffect(()=>{
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const data = res.response.device_status
        setSelected(selected)
        TreeData(data, selected)

    },[selected, res] )

    const UpdateSelected = (e => {
        setSelected(e.target.value)
    })
    const TreeData = (data, selected) => {
        data.forEach((item)=>{
            item['key'] = item.nodeInf.id
            item['name'] = item.nodeInf.id
            item['type'] = 'file'
            item['path'] = `/${item.nodeInf.selected}/${item.nodeInf.id}`
        })
        let categroiesItemsAll = Object.values(data).map(item => item.nodeInf[`${selected}`]);
        let categroiesItems = Array.from(new Set(categroiesItemsAll))
        let Treedata = []
        categroiesItems.forEach((item, index)=>{
            let Temp = {}
            Temp[selected] = item
            Temp['key'] = index
            Temp['name'] = item
            Temp['type'] = 'folder'
            Treedata.push(Temp)
        })
    
        Treedata.forEach((item)=>{
            item['children'] = data.filter((dataItem)=>{
               return item[selected]=== dataItem.nodeInf[`${selected}`]
            })
        })
        setTreedata(Treedata)
    }



    return(
        <Fragment>

            <select name="categroies" id="categroies" onChange={ UpdateSelected } defaultValue={selected}>
                {categroies.map((item,index) => {
                    return( <option key={index} value={item.value}> {item.type} </option>)
                })}
            </select>

                {Treedata.map((item, index)=>{
                    return(
                        <Tree key={index}>
                            <Folder name={item.name} key={index} >                          
                                {item.children.map((files)=>{
                                    return(
                                        <File name={files.name} key={files.nodeInf.id} id={files.nodeInf.id} selected={selected} health={files.nodeInf.health} strength={files.nodeInf.sim}></File>
                                    )
                                })}
                            </Folder>
                        </Tree>
                    )
                })}

        </Fragment>
    )
}


export default TreePlot