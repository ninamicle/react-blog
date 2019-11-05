var data = [
    {author: "Pete Hunt", text: "Questo è un commento"},
    {author: "Jordan Walke", text: "Questo è un *altro* commento"}
    ];
    

class CommentBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: []};
        }
        handleCommentSubmit(comment){
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                type: 'POST',
                data: comment,
                success: function(data) {
                  this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
              });
        }
        loadCommentsFromServer(){
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                type: 'GET',
                success: function(data) {
                  this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                  console.error(this.props.url, status, err.toString());
                }.bind(this)
              });
        }
    componentDidMount(){
       this.loadCommentsFromServer();
       setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval)
        }
    render(){
        return(
            <div className='commentBox'>
                <h1>Lista dei commenti</h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)}/>
            </div>
        );
    }
}
class CommentList extends React.Component{
    render(){
        var commentNodes = this.props.data.map((comment, indice) => {
        return(
            <Comment className='comment' author={comment.author} key={indice}>
                    {comment.text}
                </Comment>
            );
    });
    return(
        <div className='commentBox'>
            {commentNodes}
        </div>
    );
    }
}


class CommentForm extends React.Component{

    handleSubmit(event){
event.preventDefault();//impedisce il comportameno di default
var author = ReactDOM.findDOMNode(this.refs.author).value;
var text = ReactDOM.findDOMNode(this.refs.text).value;

if(!text || !author){
    return;
}
    //console.log(`${author}: ${text}`);
    this.props.onCommentSubmit({author: author, text: text});
    //Pulisco il form dopo l'esecuzione
    ReactDOM.findDOMNode(this.refs.author).value = '';
    ReactDOM.findDOMNode(this.refs.text).value = '';
    return;
    }

    
    render(){
        return(
            <form className='commentForm' onSubmit={this.handleSubmit.bind(this)}>
                <input type='text' placeholder='Il tuo nome' ref='author'/>
                <input type='text' placeholder='Il tuo commento' ref='text'/>
                <input type='submit' value='Invia'/>
            </form>
           
        );
    }
}
class Comment extends React.Component{
rawMarkup (myMarkupString){
    var md= new Remarkable();
    var rawMarkup = md.render(this.props.children);
    return{__html: rawMarkup};
}

    render(){
        
        return(
        <div className='comment'>
            <h2 className='commentAuthor'>
                {this.props.author}
            </h2>
            <span dangerouslySetInnerHTML = {this.rawMarkup()}></span>
        </div>
        );
    }
}
ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval="2000"/>,
    document.getElementById('content')
);
