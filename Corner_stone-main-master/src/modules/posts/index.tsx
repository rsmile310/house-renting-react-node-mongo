import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { ModalContainer } from './styles';
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import { uploadImages, createPost } from '../../api/post';
import { useMutation, useQuery } from '@tanstack/react-query';
import SimpleBackdrop from '../../common/backdrop';
import { getCategories } from '../../api/category';
import SimpleSelect, { StyledSelectProps } from '../../common/select';
import { getLanguages } from '../../api/language/language';
import { getCountries } from '../../api/countries/country';
import axios from 'axios';
import { AddAPhoto, AddCircle, Close } from '@mui/icons-material';

interface AddPostProps {
  open: boolean;
  onClose: (flag: boolean) => void;
  categoryId?: any;
  OnSuccessFunc?: (flag: boolean) => void;
  defaults: any;
}

const URL = import.meta.env.VITE_LOCAL_DOAMIN;

const AddPost = ({
  onClose,
  open,
  categoryId,
  OnSuccessFunc,
  defaults,
}: AddPostProps) => {
  const [images, setImages] = useState<any>([]);
  const [input, setInputs] = useState<{ [key: string]: string }>();
  const [featured, setFeatured] = useState<boolean>(false);
  const [allowedExtensions, setAllowedExtensions] = useState<string>('');
  const [allowedMimeTypes, setAllowedMimeTypes] = useState<string>('');
  const [maxUploadSize, setMaxUploadSize] = useState<number | null>();
  const [mediaAddType, setMediaAddType] = useState<string>('upload');
  const [mediaUrls, setMediaUrls] = useState([
    {
      url: '',
      type: '',
    },
  ]);
  const onDrop = (acceptedFiles: File[]) => {
    const allowedExtensionsArray = allowedExtensions.split(',');
    const allowedMimeTypesArray = allowedMimeTypes.split(',');
    const maxUploadSizeInBytes = Number(maxUploadSize) * 1048576; // converting MB to bytes

    const validFiles = acceptedFiles.filter((file) => {
      const fileExtension: any = file.name.split('.').pop()?.toLowerCase();
      return (
        allowedExtensionsArray.includes(fileExtension) &&
        allowedMimeTypesArray.includes(file.type) &&
        file.size <= (maxUploadSizeInBytes || Infinity)
      );
    });

    // Create an array of image objects
    const imageObjects = validFiles.map((file) => ({
      file,
      type: file.type,
    }));

    if (validFiles.length !== acceptedFiles.length) {
      alert('Some files are not valid. They have been ignored.');
    }

    // Set the imageObjects state
    setImages([...images, ...imageObjects]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...input, [e.target.name]: e.target.value });
  };

  const { isLoading, mutate, isSuccess } = useMutation(
    async () => {
      if (input && input.Description && input.location) {
        if (mediaAddType === 'upload') {
          const uploadedImages = await Promise.all(
            images.map(async (imageObj: any) => {
              const formData = new FormData();
              formData.append('image', imageObj.file);
              const response = await uploadImages({ formData });
              return {
                url: response.data[0],
                type: imageObj.type,
              };
            })
          );
          await createPost({
            Description: input.Description as string,
            imagesId: JSON.stringify(uploadedImages),
            title: input.title as string,
            location: input.location as string,
            categoryId: categoryId?.id,
            featured,
          });
        } else {
          await createPost({
            Description: input.Description as string,
            imagesId: JSON.stringify(mediaUrls),
            title: input.title as string,
            location: input.location as string,
            categoryId: categoryId?.id,
            featured,
          });
        }
      }
    },
    {
      onSuccess: () => {
        setImages([]);
        setFeatured(false);
        OnSuccessFunc && OnSuccessFunc(isSuccess);
      },
      onSettled: () => {
        onClose(false);
      },
    }
  );

  const { data }: any = useQuery(
    ['GetCategores'],
    async () => await getCategories(),
    {
      select: ({ data }) => {
        const result: StyledSelectProps[] = data.map(
          (val: { name: string; id: string }) => ({
            label: val.name,
            value: val,
            id: val.id,
          })
        );
        return result;
      },
    }
  );
  const { data: langauges }: any = useQuery(
    ['GetLanguages'],
    async () => await getLanguages(),
    {
      select: (data) => {
        const result = data?.map(
          (val: { id: string; code: string; name: string }) => ({
            id: val.id,
            label: val.name,
            value: val,
            code: val.code,
          })
        );
        return result;
      },
    }
  );
  const { data: countries }: any = useQuery(
    ['GetCountries'],
    async () => await getCountries(),
    {
      select: (data) => {
        const result = data?.map(
          (val: { id: string; code: string; name: string }) => ({
            id: val.id,
            label: val.name,
            value: val,
            code: val.code,
          })
        );
        return result;
      },
    }
  );

  useEffect(() => {
    axios.get(URL + '/uploads').then((response) => {
      setAllowedExtensions(response?.data?.allowedExtensions);
    });
  }, []);
  useEffect(() => {
    axios.get(URL + '/uploads').then((response) => {
      setAllowedMimeTypes(response?.data?.allowedMimeTypes);
    });
  }, []);
  useEffect(() => {
    axios.get(URL + '/uploads').then((response) => {
      setMaxUploadSize(parseInt(response?.data?.maxUploadSize));
    });
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <img
            src="/cross.png"
            alt=""
            style={{
              position: 'absolute',
              right: 4,
              top: 6,
              cursor: 'pointer',
            }}
            onClick={onClose as any}
          />
          <Typography
            component={'div'}
            textAlign={'center'}
            color={'#fff'}
            paddingBottom={0}
            fontWeight={800}
            fontSize={30}
          >
            Create Ad
          </Typography>
          <Typography component={'div'} display={'flex'}>
            {data?.length > 0 && (
              <SimpleSelect
                value={defaults?.category || undefined}
                list={data}
                onChange={() => ({})}
                placeholder="Advertisor Type"
              />
            )}
            {langauges?.length > 0 && (
              <SimpleSelect
                value={defaults?.language || undefined}
                list={langauges}
                onChange={() => ({})}
                placeholder="Ad Type"
              />
            )}
            {countries?.length > 0 && (
              <SimpleSelect
                value={defaults?.country || undefined}
                list={countries}
                onChange={() => ({})}
                placeholder="Category"
              />
            )}
          </Typography>
          <Typography component={'div'} display={'flex'} marginTop={'10px'}>
            {data?.length > 0 && (
              <SimpleSelect
                value={defaults?.category || undefined}
                list={data}
                onChange={() => ({})}
                placeholder="Ad Language"
              />
            )}
            {langauges?.length > 0 && (
              <SimpleSelect
                value={defaults?.language || undefined}
                list={langauges}
                onChange={() => ({})}
                placeholder="Region"
              />
            )}
            {countries?.length > 0 && (
              <SimpleSelect
                value={defaults?.country || undefined}
                list={countries}
                onChange={() => ({})}
                placeholder="Country"
              />
            )}
          </Typography>
          {/* <TextField
          variant="outlined"
          name="title"
          margin="dense"
          fullWidth
          onChange={handleSetInput}
          placeholder="Title"
        />
        <TextField
          variant="outlined"
          name="location"
          margin="dense"
          fullWidth
          onChange={handleSetInput}
          placeholder="Location"
        />
        <TextField
          variant="outlined"
          name="Description"
          margin="dense"
          fullWidth
          onChange={handleSetInput}
          placeholder="Description"
        /> */}
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={featured}
                  defaultChecked
                  onChange={(e) => setFeatured(e.target.checked)}
                />
              }
              label="Make this add featured"
            />
          </FormGroup>
          <FormControl>
            <FormLabel
              id="demo-radio-buttons-group-label"
              sx={{ color: '#4285F4', textAlign: 'center' }}
            >
              How would you like to add post media?
            </FormLabel>
            <Typography
              sx={{ fontWeight: 'bold', color: 'green', fontSize: 20 }}
            >
              Url added media will be posted immediatly
            </Typography>
          </FormControl>
          <Grid
            container
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Grid
              item
              md={3}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
            >
              <h2 style={{ margin: 2 }}>
                Add images <img src="/add.png" alt="" />
              </h2>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="upload"
                name="radio-buttons-group"
                sx={{
                  display: 'flex !important',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
                onChange={(e) => setMediaAddType(e.target.value)}
              >
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label="Upload"
                  sx={{ display: 'inline' }}
                />
                <FormControlLabel
                  value="add_urls"
                  control={<Radio />}
                  label="Add Urls"
                  sx={{ display: 'inline' }}
                />
              </RadioGroup>
              {mediaAddType === 'upload' ? (
                <>
                  <Box
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      // marginY: 4,
                      marginX: 10,
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <div
                        style={{
                          width: '200px',
                          height: '100px',
                          background: 'green',
                          justifyContent: 'center',
                          textAlign: 'center',
                          alignItems: 'center',
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        Drag 'n' drop some files here, or click to select files
                      </div>
                    )}
                  </Box>
                  {images?.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        marginY: 2,
                        justifyContent: 'center',
                        height: '80px',
                        overflowY: 'scroll',
                      }}
                    >
                      Images:
                      {images.map((image: any, index: any) => (
                        <Typography
                          key={index}
                          component={'span'}
                          marginX={1}
                          fontWeight="bolder"
                        >
                          {image.file.name?.slice(0, 10)}...
                        </Typography>
                      ))}
                    </Box>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      height: '100px',
                      overflowY: 'scroll',
                      width: '400px',
                    }}
                  >
                    {mediaUrls?.map((item, idx) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px 0px',
                          }}
                          key={idx}
                        >
                          <TextField
                            value={mediaUrls[idx].url}
                            onChange={(e) => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls[idx].url = e.target.value;
                              setMediaUrls(cMediaUrls);
                            }}
                            sx={{ background: 'green' }}
                          />
                          {/* <Select
                            value={mediaUrls[idx].type}
                            onChange={(e) => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls[idx].type = e.target.value;
                              setMediaUrls(cMediaUrls);
                            }}
                            sx={{ ml: 2 }}
                          >
                            <MenuItem value="video">Video</MenuItem>
                            <MenuItem value="image">Image</MenuItem>
                          </Select> */}
                          {/* <span
                            onClick={() => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls.push({
                                type: '',
                                url: '',
                              });
                              setMediaUrls(cMediaUrls);
                            }}
                          >
                            <AddCircle sx={{ ml: 1, cursor: 'pointer' }} />
                          </span> */}
                          {mediaUrls.length > 1 && (
                            <span
                              onClick={() => {
                                const cMediaUrls = [...mediaUrls];
                                cMediaUrls.splice(idx, 1);
                                setMediaUrls(cMediaUrls);
                              }}
                            >
                              <Close sx={{ ml: 2, cursor: 'pointer' }} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Grid>
            <Grid
              item
              md={3}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
            >
              <h2 style={{ margin: 2 }}>
                Add video <img src="/add.png" alt="" />
              </h2>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="upload"
                name="radio-buttons-group"
                sx={{
                  display: 'flex !important',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
                onChange={(e) => setMediaAddType(e.target.value)}
              >
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label="Upload"
                  sx={{ display: 'inline' }}
                />
                <FormControlLabel
                  value="add_urls"
                  control={<Radio />}
                  label="Add Urls"
                  sx={{ display: 'inline' }}
                />
              </RadioGroup>
              {mediaAddType === 'upload' ? (
                <>
                  <Box
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      // marginY: 4,
                      marginX: 10,
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <div
                        style={{
                          width: '200px',
                          height: '100px',
                          background: 'green',
                          justifyContent: 'center',
                          textAlign: 'center',
                          alignItems: 'center',
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        Drag 'n' drop some files here, or click to select files
                      </div>
                    )}
                  </Box>
                  {images?.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        marginY: 2,
                        justifyContent: 'center',
                        height: '80px',
                        overflowY: 'scroll',
                      }}
                    >
                      Images:
                      {images.map((image: any, index: any) => (
                        <Typography
                          key={index}
                          component={'span'}
                          marginX={1}
                          fontWeight="bolder"
                        >
                          {image.file.name?.slice(0, 10)}...
                        </Typography>
                      ))}
                    </Box>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      height: '100px',
                      overflowY: 'scroll',
                      width: '400px',
                    }}
                  >
                    {mediaUrls?.map((item, idx) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px 0px',
                          }}
                          key={idx}
                        >
                          <TextField
                            value={mediaUrls[idx].url}
                            onChange={(e) => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls[idx].url = e.target.value;
                              setMediaUrls(cMediaUrls);
                            }}
                            sx={{ background: 'green' }}
                          />
                          {/* <Select
                            value={mediaUrls[idx].type}
                            onChange={(e) => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls[idx].type = e.target.value;
                              setMediaUrls(cMediaUrls);
                            }}
                            sx={{ ml: 2 }}
                          >
                            <MenuItem value="video">Video</MenuItem>
                            <MenuItem value="image">Image</MenuItem>
                          </Select> */}
                          {/* <span
                            onClick={() => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls.push({
                                type: '',
                                url: '',
                              });
                              setMediaUrls(cMediaUrls);
                            }}
                          >
                            <AddCircle sx={{ ml: 1, cursor: 'pointer' }} />
                          </span> */}
                          {mediaUrls.length > 1 && (
                            <span
                              onClick={() => {
                                const cMediaUrls = [...mediaUrls];
                                cMediaUrls.splice(idx, 1);
                                setMediaUrls(cMediaUrls);
                              }}
                            >
                              <Close sx={{ ml: 2, cursor: 'pointer' }} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Grid>
            <Grid
              item
              md={3}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              flexDirection={'column'}
            >
              <h2 style={{ margin: 2 }}>
                Add audio <img src="/add.png" alt="" />
              </h2>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="upload"
                name="radio-buttons-group"
                sx={{
                  display: 'flex !important',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
                onChange={(e) => setMediaAddType(e.target.value)}
              >
                <FormControlLabel
                  value="upload"
                  control={<Radio />}
                  label="Upload"
                  sx={{ display: 'inline' }}
                />
                <FormControlLabel
                  value="add_urls"
                  control={<Radio />}
                  label="Add Urls"
                  sx={{ display: 'inline' }}
                />
              </RadioGroup>
              {mediaAddType === 'upload' ? (
                <>
                  <Box
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      // marginY: 4,
                      marginX: 10,
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <div
                        style={{
                          width: '200px',
                          height: '100px',
                          background: 'green',
                          justifyContent: 'center',
                          textAlign: 'center',
                          alignItems: 'center',
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        Drag 'n' drop some files here, or click to select files
                      </div>
                    )}
                  </Box>
                  {images?.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        marginY: 2,
                        justifyContent: 'center',
                        height: '80px',
                        overflowY: 'scroll',
                      }}
                    >
                      Images:
                      {images.map((image: any, index: any) => (
                        <Typography
                          key={index}
                          component={'span'}
                          marginX={1}
                          fontWeight="bolder"
                        >
                          {image.file.name?.slice(0, 10)}...
                        </Typography>
                      ))}
                    </Box>
                  )}
                </>
              ) : (
                <>
                  <div
                    style={{
                      height: '100px',
                      overflowY: 'scroll',
                      width: '400px',
                    }}
                  >
                    {mediaUrls?.map((item, idx) => {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '5px 0px',
                          }}
                          key={idx}
                        >
                          <TextField
                            value={mediaUrls[idx].url}
                            onChange={(e) => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls[idx].url = e.target.value;
                              setMediaUrls(cMediaUrls);
                            }}
                            sx={{ background: 'green' }}
                          />
                          {/* <Select
                            value={mediaUrls[idx].type}
                            onChange={(e) => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls[idx].type = e.target.value;
                              setMediaUrls(cMediaUrls);
                            }}
                            sx={{ ml: 2 }}
                          >
                            <MenuItem value="video">Video</MenuItem>
                            <MenuItem value="image">Image</MenuItem>
                          </Select> */}
                          {/* <span
                            onClick={() => {
                              const cMediaUrls = [...mediaUrls];
                              cMediaUrls.push({
                                type: '',
                                url: '',
                              });
                              setMediaUrls(cMediaUrls);
                            }}
                          >
                            <AddCircle sx={{ ml: 1, cursor: 'pointer' }} />
                          </span> */}
                          {mediaUrls.length > 1 && (
                            <span
                              onClick={() => {
                                const cMediaUrls = [...mediaUrls];
                                cMediaUrls.splice(idx, 1);
                                setMediaUrls(cMediaUrls);
                              }}
                            >
                              <Close sx={{ ml: 2, cursor: 'pointer' }} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h2>Also post on our media platforms</h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <>
                        <img src="/yt.png" alt="" style={{ width: 18 }} />
                      </>
                    }
                    labelPlacement="start"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <>
                        <img src="/ig.png" alt="" style={{ width: 18 }} />
                      </>
                    }
                    labelPlacement="start"
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <>
                        <img src="/twt.png" alt="" style={{ width: 18 }} />
                      </>
                    }
                    labelPlacement="start"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <>
                        <img src="/fb.png" alt="" style={{ width: 18 }} />
                      </>
                    }
                    labelPlacement="start"
                  />
                </FormGroup>
              </div>
            </div>
          </Box>
          <Box
            width={'100%'}
            justifyContent={'end'}
            display={'flex'}
            height={'25px'}
          >
            <Button
              variant="contained"
              onClick={() => mutate()}
              sx={{
                borderRadius: '8px',
                py: 2,
                background: 'green',
                fontWeight: 700,
                textTransform: 'capitalize',
                fontSize: '20px',
                '&:hover': {
                  background: 'green',
                },
                mt: -4,
              }}
            >
              Create Ad
            </Button>
          </Box>
        </div>

        <SimpleBackdrop open={isLoading} />
      </ModalContainer>
    </Modal>
  );
};

export default AddPost;
