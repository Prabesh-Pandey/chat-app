
const errorHandler = (error,req,res,next) => {
    res.status(500).json({
        success:false,
        message:error.message
    });
};

export default errorHandler;