import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends Component{
	selectBox=()=>{
		this.props.selectbox(this.props.row,this.props.col);
	}
	render(){
		return(
			<div 
			className={this.props.boxClass}
			id={this.props.id}
			onClick={this.selectBox}
			/>
			);
	}
}

class Grid extends Component{
	render(){
		const width=this.props.cols*16;
		let rowArr=[];
		for(let i=0;i<this.props.rows;i++){
			for(let j=0;j<this.props.cols;j++){
				let boxid=i+"_"+j;

				var boxClass=this.props.gridfull[i][j] ? "box on" : "box off";
				rowArr.push(
					<Box
					boxClass={boxClass}
					key={boxid}
					row={i}
					col={j}
					selectbox={this.props.selectbox}
					/>
					);
			}
		}
		return(
				<div className='grid' style={{width: width}}>
					{rowArr}
				</div>
			);
	}
}

class Button extends Component{

	handleselect=(evt)=>{
		this.props.gridsize(evt);
	}

	render(){
		return(
			<div className='btns'>
			 <button className='btn' onClick={this.props.playbutton}>play</button>
			 <button className='btn' onClick={this.props.pausebutton}>pause</button>
			 <button className='btn' onClick={this.props.fast}>fast</button>
			 <button className='btn' onClick={this.props.slow}>slow</button>
			 <button className='btn' onClick={this.props.seed}>seed</button>
			 <button className='btn' onClick={this.props.clear}>clear</button>
			 <select onChange={this.handleselect} title="grid size" id="size-menu">
			  <option key='1'>20x10</option>
			  <option key='2'>50x30</option>
			  <option key='3'>70x50</option>
			 </select>
			</div>
			);
	}
}

class Main extends Component{
	constructor(){
		super();
		this.speed=100;
		this.cols=50;
		this.rows=30;

		this.state={
			generation: 0,
			gridfull: Array(this.rows).fill().map(()=>Array(this.cols).fill(false)),
		}
	}


	seed=()=>{
		let gridclone=this.state.gridfull;
		for(let i=0;i<this.rows;i++){
			for(let j=0;j<this.cols;j++){
				if(Math.floor(Math.random()*4)===1){
					gridclone[i][j]=!gridclone[i][j];
				}
			}
		}
		this.setState({
			gridfull: gridclone
		})
	}


	selectbox=(row,col)=>{
		let gridcopy=this.state.gridfull;
		gridcopy[row][col]=!gridcopy[row][col];
		this.setState({
			gridfull: gridcopy
		});
	}

	playbutton=()=>{
		clearInterval(this.intervalId)
		this.intervalId=setInterval(this.play,this.speed);
	}

	pausebutton=()=>{
		clearInterval(this.intervalId);
	}

	fast=()=>{
		this.speed=100;
		this.playbutton();
	}

	slow=()=>{
		this.speed=1000;
		this.playbutton();
	}

	clear=()=>{
		let arr=Array(this.rows).fill().map(()=>Array(this.cols).fill(false));
		this.setState({
			gridfull: arr,
			generation: 0
		});
		this.pausebutton();
	}

 	gridsize=(size)=>{
 		switch(size){
 			case "1": 
 			 this.cols=20;
 			 this.rows=10;
 			break;
 			case "2": 
 			 this.cols=50;
 			 this.rows=30;
 			break;
 			default: 
 			 this.cols=70;
 			 this.rows=50;
 		}
 		this.clear();
 	}

	play=()=>{
		let g=this.state.gridfull;
		let g2=this.state.gridfull;
		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
			    let count = 0;
			    if (i > 0) if (g[i - 1][j]) count++;
			    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
			    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
			    if (j < this.cols - 1) if (g[i][j + 1]) count++;
			    if (j > 0) if (g[i][j - 1]) count++;
			    if (i < this.rows - 1) if (g[i + 1][j]) count++;
			    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
			    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
			    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
			    if (!g[i][j] && count === 3) g2[i][j] = true;
				}
		}

		this.setState({
			gridfull: g2,
			generation: this.state.generation+1
		})
	}

	componentDidMount(){
		this.seed();
		this.playbutton();
	}

	render(){
		return(
			<div>
			<h1>Game of Life</h1>
			<Button
			 playbutton={this.playbutton}
			 pausebutton={this.pausebutton}
			 slow={this.slow}
			 fast={this.fast}
			 clear={this.clear}
			 seed={this.seed}
			 gridsize={this.gridsize}
			 />
				<Grid
				 gridfull={this.state.gridfull}
				 rows={this.rows}
				 cols={this.cols}
				 selectbox={this.selectbox}
				/>
				<h2>Generation: {this.state.generation}</h2>
			</div>
			);
	}
}

ReactDOM.render(<Main/>, document.getElementById('root'));
