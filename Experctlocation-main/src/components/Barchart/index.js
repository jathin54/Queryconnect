import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
  } from "recharts"
  

  
  const Appp = (props) => {
    const {skills} = props
     const arr = skills.map(each => each.split("-"))
     const data = arr.map(each =>({group_name:each[0],boys:parseInt(each[1])}))
    
    const DataFormatter = (number) => {
      if (number > 1000) {
        return `${(number / 1000).toString()}k`
      }
      return number.toString()
    }
  
    return (
    
      <ResponsiveContainer width="70%" height={500} style={{marginLeft:"100px",marginTop:"60px"}}>
        <BarChart
          data={data}
          margin={{
            top: 5,

          }}
        >
          <XAxis
            dataKey="group_name"
            tick={{
              stroke: "gray",
              strokeWidth: 1,
            }}
          />
          <YAxis
            tickFormatter={DataFormatter}
            tick={{
              stroke: "gray",
              strokeWidth: 0,
            }}
          />
          <Legend
            wrapperStyle={{
              padding: 30,
            }}
          />
          <Bar dataKey="boys" name="Technologies" fill="#1f77b4" barSize="20%" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  
  export default Appp