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
    componentDidMount(){
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
    render(){
        return(
            <div className='commentBox'>
                <h1>Lista dei commenti</h1>
                <CommentList data={this.state.data}/>
                <CommentForm/>
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
    render(){
        return(
            <div className='commentForm'>
                Io sono un CommentForm!
            </div>
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
    <CommentBox url="/api/comments"/>,
    document.getElementById('content')
);
